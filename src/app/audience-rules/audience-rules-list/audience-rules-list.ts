import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AudienceRulesApiService, type SavedAudienceRule } from '../audience-rules-api.service';
import type { RuleTreePayload } from '../rule-builder.model';

function countConditionsInGroup(group: RuleTreePayload.Group): number {
  return (
    group.conditions.length + group.groups.reduce((n, child) => n + countConditionsInGroup(child), 0)
  );
}

@Component({
  selector: 'app-audience-rules-list',
  imports: [DatePipe, JsonPipe],
  templateUrl: './audience-rules-list.html',
})
export class AudienceRulesList {
  private readonly api = inject(AudienceRulesApiService);

  protected readonly rules = signal<SavedAudienceRule[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly displayRules = computed(() =>
    [...this.rules()].sort((a, b) => (a.storedAt < b.storedAt ? 1 : -1)),
  );

  constructor() {
    this.fetchRules();
  }

  protected refresh(): void {
    this.fetchRules();
  }

  protected conditionCount(rule: SavedAudienceRule): number {
    return countConditionsInGroup(rule.root);
  }

  private fetchRules(): void {
    this.loading.set(true);
    this.error.set(null);
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
