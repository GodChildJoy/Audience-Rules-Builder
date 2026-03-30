import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudienceRulesListRefreshService {
  private readonly generation = signal(0);

  /** Read in an effect to reload the saved-rules list when this changes. */
  readonly version = this.generation.asReadonly();

  notifyRuleSaved(): void {
    this.generation.update((n) => n + 1);
  }
}
