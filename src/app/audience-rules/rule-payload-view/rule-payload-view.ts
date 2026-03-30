import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LOGIC_COMBINE_HELPER, type RuleTreePayload } from '../rule-builder.model';

@Component({
  selector: 'app-rule-payload-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RulePayloadView],
  templateUrl: './rule-payload-view.html',
})
export class RulePayloadView {
  readonly group = input.required<RuleTreePayload.Group>();
  /** Nested group: purple border card like the builder */
  readonly nested = input(false);

  protected readonly helper = LOGIC_COMBINE_HELPER;
}
