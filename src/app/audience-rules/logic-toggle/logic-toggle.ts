import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LOGIC_COMBINE_HELPER, type LogicOperator } from '../rule-builder.model';
import { RuleBuilderService } from '../rule-builder.service';

@Component({
  selector: 'app-logic-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './logic-toggle.html',
})
export class LogicToggle {
  readonly groupId = input.required<string>();
  readonly logic = input.required<LogicOperator>();
  private readonly ruleBuilder = inject(RuleBuilderService);

  protected readonly helper = LOGIC_COMBINE_HELPER;

  protected setLogic(next: LogicOperator): void {
    if (next !== this.logic()) {
      this.ruleBuilder.setGroupLogic(this.groupId(), next);
    }
  }
}
