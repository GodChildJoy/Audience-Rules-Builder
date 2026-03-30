import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { AudienceRulesApiService, type SavedAudienceRule } from '../audience-rules-api.service';
import { RulePayloadView } from '../rule-payload-view/rule-payload-view';
import type { RuleTreePayload } from '../rule-builder.model';

function countConditionsInGroup(group: RuleTreePayload.Group): number {
  return (
    group.conditions.length + group.groups.reduce((n, child) => n + countConditionsInGroup(child), 0)
  );
}

@Component({
  selector: 'app-audience-rules-list',
  imports: [DatePipe, RulePayloadView],
  templateUrl: './audience-rules-list.html',
})
export class AudienceRulesList {
  private readonly api = inject(AudienceRulesApiService);

  protected readonly rules = signal<SavedAudienceRule[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);
  protected readonly deleteError = signal<string | null>(null);

  protected readonly displayRules = computed(() =>
    [...this.rules()].sort((a, b) => (a.storedAt < b.storedAt ? 1 : -1)),
  );

  constructor() {
    effect(() => {
      this.api.savedRulesListVersion();
      this.fetchRules();
    });
  }

  protected conditionCount(rule: SavedAudienceRule): number {
    return countConditionsInGroup(rule.root);
  }

  protected isDeleting(rule: SavedAudienceRule): boolean {
    return this.deletingId() === rule.id;
  }

  protected deleteRule(rule: SavedAudienceRule, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteError.set(null);
    if (!globalThis.confirm(`Delete saved rule "${rule.name}"?`)) {
      return;
    }
    this.deletingId.set(rule.id);
    this.api.deleteRule(rule.id).subscribe({
      next: () => {
        this.rules.update((list) => list.filter((r) => r.id !== rule.id));
        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
        this.deleteError.set('Could not delete rule. Check the API and try again.');
      },
    });
  }

  private fetchRules(): void {
    this.loading.set(true);
    this.error.set(null);
    this.deleteError.set(null);
    this.api.listRules().subscribe({
      next: (list) => {
        this.rules.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load saved rules. Is the API running on port 3000?');
        this.loading.set(false);
      },
    });
  }
}
