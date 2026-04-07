import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AudienceRulesApiService } from './audience-rules-api.service';
import {
  FIELD_OPTIONS,
  createCondition,
  createRuleGroup,
  getOperatorsForField,
  toMinimalRuleGroup,
  type FieldId,
  type LogicOperator,
  type RuleCondition,
  type RuleGroup,
} from './rule-builder.model';

export interface ConditionErrors {
  field?: string;
  operator?: string;
  value?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RuleBuilderService {
  private readonly audienceRulesApi = inject(AudienceRulesApiService);

  readonly root = signal<RuleGroup>(this.createInitialRoot());
  readonly showValidation = signal(false);
  /** True while a save request is in flight (after validation passes). */
  readonly saveInProgress = signal(false);
  readonly isValid = computed(() => this.validateGroup(this.root()));
  readonly hasValidationErrors = computed(() => this.showValidation() && !this.isValid());

  findGroup(groupId: string): RuleGroup | null {
    return this.findGroupInTree(this.root(), groupId);
  }

  setGroupLogic(groupId: string, logic: LogicOperator): void {
    this.updateGroup(groupId, (group) => ({ ...group, logic }));
  }

  patchCondition(
    groupId: string,
    conditionId: string,
    partial: Partial<Pick<RuleCondition, 'field' | 'operator' | 'value'>>,
  ): void {
    this.updateGroup(groupId, (group) => ({
      ...group,
      conditions: group.conditions.map((condition) =>
        condition.id === conditionId
          ? (() => {
              const next = { ...condition, ...partial };
              const allowed = getOperatorsForField(next.field);
              if (!allowed.some((op) => op.id === next.operator)) {
                next.operator = allowed[0]?.id ?? next.operator;
              }
              return next;
            })()
          : condition,
      ),
    }));
  }

  removeCondition(groupId: string, conditionId: string): void {
    const [nextRoot, updated] = this.removeConditionWithPrune(this.root(), groupId, conditionId, true);
    if (updated) {
      this.root.set(nextRoot);
    }
  }

  addCondition(groupId: string): void {
    const nextFieldId = this.findFirstUnusedFieldId();
    if (!nextFieldId) {
      return;
    }
    this.updateGroup(groupId, (group) => ({
      ...group,
      conditions: [...group.conditions, createCondition(nextFieldId)],
    }));
  }

  addGroup(parentGroupId: string): void {
    this.updateGroup(parentGroupId, (group) => ({
      ...group,
      groups: [...group.groups, createRuleGroup(true)],
    }));
  }

  getConditionErrors(condition: RuleCondition): ConditionErrors {
    const errors: ConditionErrors = {};
    const usageCounts = this.getFieldUsageCounts(this.root());
    const fieldExists = FIELD_OPTIONS.some((field) => field.id === condition.field);
    if (!fieldExists) {
      errors.field = 'Select a valid field.';
      errors.operator = 'Select a valid operator.';
      return errors;
    }
    if ((usageCounts.get(condition.field) ?? 0) > 1) {
      errors.field = 'Field can only be selected once.';
    }

    const allowed = getOperatorsForField(condition.field);
    if (!allowed.some((op) => op.id === condition.operator)) {
      errors.operator = 'Select a valid operator for this field.';
    }

    if (!condition.value.trim()) {
      errors.value = 'Value is required.';
      return errors;
    }

    if (condition.field === 'purchaseCount' && Number.isNaN(Number(condition.value))) {
      errors.value = 'Value must be a number.';
    }

    if (condition.field === 'signupDate' && Number.isNaN(Date.parse(condition.value))) {
      errors.value = 'Value must be a valid date.';
    }

    return errors;
  }

  isFieldUsedByOther(fieldId: string, conditionId: string): boolean {
    return this.collectConditions(this.root()).some((c) => c.id !== conditionId && c.field === fieldId);
  }

  saveRule(): void {
    this.showValidation.set(true);
    if (!this.isValid()) {
      return;
    }
    if (this.saveInProgress()) {
      return;
    }
    const name = `Audience Rule ${crypto.randomUUID()}`;
    const payload = {
      name,
      root: toMinimalRuleGroup(this.root()),
      savedAt: new Date().toISOString(),
    };
    this.saveInProgress.set(true);
    this.audienceRulesApi
      .saveRule(payload)
      .pipe(finalize(() => this.saveInProgress.set(false)))
      .subscribe({
        next: () => {
          this.audienceRulesApi.notifyRuleSaved();
        },
        error: (err) => console.error('Failed to save audience rule', err),
      });
  }

  private updateGroup(groupId: string, updater: (group: RuleGroup) => RuleGroup): void {
    const [nextRoot, updated] = this.updateGroupInTree(this.root(), groupId, updater);
    if (updated) {
      this.root.set(nextRoot);
    }
  }

  private findGroupInTree(group: RuleGroup, groupId: string): RuleGroup | null {
    if (group.id === groupId) {
      return group;
    }

    for (const child of group.groups) {
      const found = this.findGroupInTree(child, groupId);
      if (found) {
        return found;
      }
    }

    return null;
  }

  private updateGroupInTree(
    group: RuleGroup,
    groupId: string,
    updater: (target: RuleGroup) => RuleGroup,
  ): [RuleGroup, boolean] {
    if (group.id === groupId) {
      return [updater(group), true];
    }

    let didUpdate = false;
    const nextGroups = group.groups.map((child) => {
      const [updatedChild, updated] = this.updateGroupInTree(child, groupId, updater);
      if (updated) {
        didUpdate = true;
      }
      return updatedChild;
    });

    if (!didUpdate) {
      return [group, false];
    }

    return [{ ...group, groups: nextGroups }, true];
  }

  private removeConditionWithPrune(
    group: RuleGroup,
    groupId: string,
    conditionId: string,
    isRoot: boolean,
  ): [RuleGroup, boolean, boolean] {
    if (group.id === groupId) {
      const nextConditions = group.conditions.filter((condition) => condition.id !== conditionId);
      const nextGroup = { ...group, conditions: nextConditions };
      const deleteSelf = !isRoot && nextConditions.length === 0;
      return [nextGroup, nextConditions.length !== group.conditions.length, deleteSelf];
    }

    let didUpdate = false;
    const nextChildren: RuleGroup[] = [];

    for (const child of group.groups) {
      const [nextChild, childUpdated, deleteChild] = this.removeConditionWithPrune(child, groupId, conditionId, false);
      if (childUpdated || deleteChild) {
        didUpdate = true;
      }
      if (!deleteChild) {
        nextChildren.push(nextChild);
      }
    }

    if (!didUpdate) {
      return [group, false, false];
    }

    return [{ ...group, groups: nextChildren }, true, false];
  }

  private createInitialRoot(): RuleGroup {
    return {
      id: crypto.randomUUID(),
      logic: 'AND',
      conditions: [createCondition()],
      groups: [createRuleGroup(false)],
    };
  }

  private validateGroup(group: RuleGroup): boolean {
    if (group.conditions.length === 0) {
      return false;
    }

    const conditionsValid = group.conditions.every((condition) => {
      const errors = this.getConditionErrors(condition);
      return !errors.field && !errors.operator && !errors.value;
    });

    if (!conditionsValid) {
      return false;
    }

    return group.groups.every((child) => this.validateGroup(child));
  }

  private collectConditions(group: RuleGroup): RuleCondition[] {
    return [
      ...group.conditions,
      ...group.groups.flatMap((child) => this.collectConditions(child)),
    ];
  }

  private getFieldUsageCounts(group: RuleGroup): Map<string, number> {
    const counts = new Map<string, number>();
    for (const condition of this.collectConditions(group)) {
      counts.set(condition.field, (counts.get(condition.field) ?? 0) + 1);
    }
    return counts;
  }

  private findFirstUnusedFieldId(): FieldId | null {
    const used = new Set(this.collectConditions(this.root()).map((condition) => condition.field));
    for (const field of FIELD_OPTIONS) {
      if (!used.has(field.id)) {
        return field.id;
      }
    }
    return null;
  }
}
