import { Injectable, signal } from '@angular/core';
import { createCondition, createRuleGroup, getOperatorsForField, type Condition, type LogicOperator, type RuleGroup } from './rule-builder.model';

@Injectable({
  providedIn: 'root',
})
export class RuleBuilderService {
  readonly root = signal<RuleGroup>(this.createInitialRoot());

  findGroup(groupId: string): RuleGroup | null {
    return this.findGroupInTree(this.root(), groupId);
  }

  setGroupLogic(groupId: string, logic: LogicOperator): void {
    this.updateGroup(groupId, (group) => ({ ...group, logic }));
  }

  patchCondition(groupId: string, conditionId: string, partial: Partial<Condition>): void {
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
    this.updateGroup(groupId, (group) => ({
      ...group,
      conditions: group.conditions.filter((condition) => condition.id !== conditionId),
    }));
  }

  addCondition(groupId: string): void {
    this.updateGroup(groupId, (group) => ({
      ...group,
      conditions: [...group.conditions, createCondition()],
    }));
  }

  addGroup(parentGroupId: string): void {
    this.updateGroup(parentGroupId, (group) => ({
      ...group,
      groups: [...group.groups, createRuleGroup(true)],
    }));
  }

  saveRule(): void {
    console.log('Audience rule payload', this.root());
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

  private createInitialRoot(): RuleGroup {
    return {
      id: crypto.randomUUID(),
      logic: 'AND',
      conditions: [createCondition(), createCondition()],
      groups: [createRuleGroup(false)],
    };
  }
}
