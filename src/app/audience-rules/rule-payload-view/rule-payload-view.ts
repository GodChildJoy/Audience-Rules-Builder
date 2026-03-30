import { Component, input } from '@angular/core';
import type { LogicOperator, RuleTreePayload } from '../rule-builder.model';

@Component({
  selector: 'app-rule-payload-view',
  imports: [RulePayloadView],
  templateUrl: './rule-payload-view.html',
})
export class RulePayloadView {
  readonly group = input.required<RuleTreePayload.Group>();
  /** Nested group: purple border card like the builder */
  readonly nested = input(false);

  protected readonly helper: Record<LogicOperator, string> = {
    AND: 'ALL CONDITIONS MUST MATCH',
    OR: 'ANY CONDITION MUST MATCH',
  };
}
