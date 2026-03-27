import { Component, input, output } from '@angular/core';
import type { LogicOperator } from '../rule-builder.model';

@Component({
  selector: 'app-logic-toggle',
  imports: [],
  templateUrl: './logic-toggle.html',
  styleUrl: './logic-toggle.css',
})
export class LogicToggle {
  readonly logic = input.required<LogicOperator>();
  readonly logicChange = output<LogicOperator>();

  protected readonly helper: Record<LogicOperator, string> = {
    AND: 'ALL CONDITIONS MUST MATCH',
    OR: 'ANY CONDITION MUST MATCH',
  };

  protected setLogic(next: LogicOperator): void {
    if (next !== this.logic()) {
      this.logicChange.emit(next);
    }
  }
}
