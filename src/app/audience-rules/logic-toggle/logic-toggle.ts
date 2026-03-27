import { Component, inject, input } from '@angular/core';
import type { LogicOperator } from '../rule-builder.model';
import { RuleBuilderService } from '../rule-builder.service';

@Component({
  selector: 'app-logic-toggle',
  imports: [],
  templateUrl: './logic-toggle.html',
})
export class LogicToggle {
  readonly groupId = input.required<string>();
  readonly logic = input.required<LogicOperator>();
  private readonly ruleBuilder = inject(RuleBuilderService);

  protected readonly helper: Record<LogicOperator, string> = {
    AND: 'ALL CONDITIONS MUST MATCH',
    OR: 'ANY CONDITION MUST MATCH',
  };

  protected setLogic(next: LogicOperator): void {
    if (next !== this.logic()) {
      this.ruleBuilder.setGroupLogic(this.groupId(), next);
    }
  }
}
