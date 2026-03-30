import { Component, inject, signal } from '@angular/core';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { RuleBuilderService } from '../rule-builder.service';
import { toMinimalRuleGroup } from '../rule-builder.model';

@Component({
  selector: 'app-matching-contacts',
  imports: [],
  templateUrl: './matching-contacts.html',
})
export class MatchingContacts {
  private readonly api = inject(AudienceRulesApiService);
  private readonly ruleBuilder = inject(RuleBuilderService);

  protected readonly matches = signal<{ name: string; email: string }[] | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected preview(): void {
    this.ruleBuilder.showValidation.set(true);
    if (!this.ruleBuilder.isValid()) {
      this.error.set('Fix validation errors, then preview matches.');
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    const root = toMinimalRuleGroup(this.ruleBuilder.root());
    this.api.evaluateRule({ root }).subscribe({
      next: (res) => {
        this.matches.set(res.matches);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not evaluate matches. Is the API running on port 3000?');
      },
    });
  }

  protected initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
