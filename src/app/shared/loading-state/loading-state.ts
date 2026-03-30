import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LoadingStateVariant = 'list' | 'chips' | 'inline';

@Component({
  selector: 'app-loading-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loading-state.html',
  host: {
    class: 'block',
  },
})
export class LoadingStateComponent {
  readonly message = input<string>('Loading…');
  readonly variant = input<LoadingStateVariant>('inline');
}
