import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import {
  FIELD_OPTIONS,
  getFieldDef,
  getOperatorsForField,
  type FieldId,
  type OperatorDef,
  type RuleCondition,
  type RuleOperatorId,
} from '../rule-builder.model';
import { RuleBuilderService, type ConditionErrors } from '../rule-builder.service';

@Component({
  selector: 'app-rule-condition-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './rule-condition-row.html',
})
export class RuleConditionRow {
  readonly groupId = input.required<string>();
  readonly condition = input.required<RuleCondition>();
  private readonly ruleBuilder = inject(RuleBuilderService);
  protected readonly showValidation = this.ruleBuilder.showValidation;

  protected readonly fields = FIELD_OPTIONS;

  /** Depends on `root` so uniqueness validation updates when siblings change. */
  protected readonly operatorsForField = computed((): readonly OperatorDef[] =>
    getOperatorsForField(this.condition().field),
  );

  protected readonly conditionErrors = computed((): ConditionErrors => {
    this.ruleBuilder.root();
    return this.ruleBuilder.getConditionErrors(this.condition());
  });

  protected readonly disabledFieldIds = computed((): ReadonlySet<FieldId> => {
    this.ruleBuilder.root();
    const cid = this.condition().id;
    return new Set(
      FIELD_OPTIONS.filter((f) => this.ruleBuilder.isFieldUsedByOther(f.id, cid)).map(
        (f) => f.id,
      ),
    );
  });

  protected readonly firstValidationError = computed((): string | undefined => {
    const e = this.conditionErrors();
    return e.field ?? e.operator ?? e.value;
  });

  protected patch(partial: Partial<Pick<RuleCondition, 'field' | 'operator' | 'value'>>): void {
    this.ruleBuilder.patchCondition(this.groupId(), this.condition().id, partial);
  }

  protected onFieldChange(raw: string): void {
    const fieldId = getFieldDef(raw).id;
    const operators = getOperatorsForField(fieldId);
    const operator = operators.some((o) => o.id === this.condition().operator)
      ? this.condition().operator
      : operators[0]?.id;
    this.patch({ field: fieldId, operator });
  }

  protected onOperatorChange(raw: string): void {
    this.patch({ operator: raw as RuleOperatorId });
  }

  protected isFieldDisabled(fieldId: FieldId): boolean {
    return this.disabledFieldIds().has(fieldId);
  }

  protected isDateField(): boolean {
    return this.condition().field === 'signupDate';
  }

  protected remove(): void {
    this.ruleBuilder.removeCondition(this.groupId(), this.condition().id);
  }
}
