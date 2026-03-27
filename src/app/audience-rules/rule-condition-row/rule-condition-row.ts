import { Component, inject, input } from '@angular/core';
import { FIELD_OPTIONS, getOperatorsForField, type Condition, type OperatorDef } from '../rule-builder.model';
import { RuleBuilderService } from '../rule-builder.service';

@Component({
  selector: 'app-rule-condition-row',
  imports: [],
  templateUrl: './rule-condition-row.html',
})
export class RuleConditionRow {
  readonly groupId = input.required<string>();
  readonly condition = input.required<Condition>();
  private readonly ruleBuilder = inject(RuleBuilderService);

  protected readonly fields = FIELD_OPTIONS;
  protected getOperators(): OperatorDef[] {
    return getOperatorsForField(this.condition().field);
  }

  protected patch(partial: Partial<Condition>): void {
    this.ruleBuilder.patchCondition(this.groupId(), this.condition().id, partial);
  }

  protected onFieldChange(fieldId: string): void {
    const operators = getOperatorsForField(fieldId);
    const operator = operators.some((o) => o.id === this.condition().operator) ? this.condition().operator : operators[0]?.id;
    this.patch({ field: fieldId, operator });
  }

  protected isDateField(): boolean {
    return this.condition().field === 'signupDate';
  }

  protected remove(): void {
    this.ruleBuilder.removeCondition(this.groupId(), this.condition().id);
  }
}
