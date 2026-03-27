import { Component, input, output } from '@angular/core';
import { FIELD_OPTIONS, OPERATOR_OPTIONS, type Condition } from '../rule-builder.model';

@Component({
  selector: 'app-rule-condition-row',
  imports: [],
  templateUrl: './rule-condition-row.html',
  styleUrl: './rule-condition-row.css',
})
export class RuleConditionRow {
  readonly condition = input.required<Condition>();
  readonly conditionChange = output<Condition>();
  readonly removed = output<void>();

  protected readonly fields = FIELD_OPTIONS;
  protected readonly operators = OPERATOR_OPTIONS;

  protected patch(partial: Partial<Condition>): void {
    this.conditionChange.emit({ ...this.condition(), ...partial });
  }

  protected isDateField(): boolean {
    return this.condition().field === 'signupDate';
  }
}
