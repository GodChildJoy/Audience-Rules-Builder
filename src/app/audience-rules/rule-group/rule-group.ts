import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LogicToggle } from '../logic-toggle/logic-toggle';
import { RuleConditionRow } from '../rule-condition-row/rule-condition-row';
import { RuleBuilderService } from '../rule-builder.service';

@Component({
  selector: 'app-rule-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogicToggle, RuleConditionRow, RuleGroupComponent],
  templateUrl: './rule-group.html',
})
export class RuleGroupComponent {
  readonly groupId = input.required<string>();
  readonly nested = input(false);
  private readonly ruleBuilder = inject(RuleBuilderService);
  protected readonly group = computed(() => {
    this.ruleBuilder.root();
    const group = this.ruleBuilder.findGroup(this.groupId());
    if (!group) {
      throw new Error(`Rule group not found: ${this.groupId()}`);
    }
    return group;
  });

  protected addNestedCondition(): void {
    this.ruleBuilder.addCondition(this.groupId());
  }

  protected addNestedGroup(): void {
    this.ruleBuilder.addGroup(this.groupId());
  }
}
