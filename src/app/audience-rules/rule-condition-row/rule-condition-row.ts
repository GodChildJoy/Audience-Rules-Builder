import { Component, inject, input } from '@angular/core';
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
  imports: [],
  templateUrl: './rule-condition-row.html',
})
export class RuleConditionRow {
  readonly groupId = input.required<string>();
  readonly condition = input.required<RuleCondition>();
  private readonly ruleBuilder = inject(RuleBuilderService);
  protected readonly showValidation = this.ruleBuilder.showValidation;

  protected readonly fields = FIELD_OPTIONS;
  protected getOperators(): readonly OperatorDef[] {
    return getOperatorsForField(this.condition().field);
  }

  protected patch(partial: Partial<Pick<RuleCondition, 'field' | 'operator' | 'value'>>): void {
    this.ruleBuilder.patchCondition(this.groupId(), this.condition().id, partial);
  }

  protected onFieldChange(raw: string): void {
    const fieldId = getFieldDef(raw).id;
    const operators = getOperatorsForField(fieldId);
    const operator = operators.some((o) => o.id === this.condition().operator) ? this.condition().operator : operators[0]?.id;
    this.patch({ field: fieldId, operator });
  }

  protected onOperatorChange(raw: string): void {
    this.patch({ operator: raw as RuleOperatorId });
  }

  protected isFieldDisabled(fieldId: FieldId): boolean {
    return this.ruleBuilder.isFieldUsedByOther(fieldId, this.condition().id);
  }

  protected isDateField(): boolean {
    return this.condition().field === 'signupDate';
  }

  protected errors(): ConditionErrors {
    return this.ruleBuilder.getConditionErrors(this.condition());
  }

  protected firstError(): string | undefined {
    const errors = this.errors();
    return errors.field ?? errors.operator ?? errors.value;
  }

  protected remove(): void {
    this.ruleBuilder.removeCondition(this.groupId(), this.condition().id);
  }
}
