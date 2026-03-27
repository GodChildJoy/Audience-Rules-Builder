import { Component, inject, input } from '@angular/core';
import { FIELD_OPTIONS, OPERATOR_OPTIONS, type Condition } from '../rule-builder.model';
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
  protected readonly operators = OPERATOR_OPTIONS;

  protected patch(partial: Partial<Condition>): void {
    this.ruleBuilder.patchCondition(this.groupId(), this.condition().id, partial);
  }

  protected isDateField(): boolean {
    return this.condition().field === 'signupDate';
  }

  protected remove(): void {
    this.ruleBuilder.removeCondition(this.groupId(), this.condition().id);
  }
}
