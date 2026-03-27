import { Component, forwardRef, input, output } from '@angular/core';
import { LogicToggle } from '../logic-toggle/logic-toggle';
import { RuleConditionRow } from '../rule-condition-row/rule-condition-row';
import { createCondition, type Condition, type RuleGroup } from '../rule-builder.model';

@Component({
  selector: 'app-rule-group',
  imports: [LogicToggle, RuleConditionRow, forwardRef(() => RuleGroupComponent)],
  templateUrl: './rule-group.html',
})
export class RuleGroupComponent {
  readonly group = input.required<RuleGroup>();
  readonly nested = input(false);
  readonly groupChange = output<RuleGroup>();

  protected onLogicChange(logic: RuleGroup['logic']): void {
    const g = this.group();
    this.groupChange.emit({ ...g, logic });
  }

  protected onConditionChange(updated: Condition): void {
    const g = this.group();
    const conditions = g.conditions.map((c) => (c.id === updated.id ? updated : c));
    this.groupChange.emit({ ...g, conditions });
  }

  protected removeCondition(id: string): void {
    const g = this.group();
    this.groupChange.emit({ ...g, conditions: g.conditions.filter((c) => c.id !== id) });
  }

  protected onChildChange(child: RuleGroup): void {
    const g = this.group();
    const groups = g.groups.map((c) => (c.id === child.id ? child : c));
    this.groupChange.emit({ ...g, groups });
  }

  protected addNestedCondition(): void {
    const g = this.group();
    this.groupChange.emit({ ...g, conditions: [...g.conditions, createCondition()] });
  }
}
