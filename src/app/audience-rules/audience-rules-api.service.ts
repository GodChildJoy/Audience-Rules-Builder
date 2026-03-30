import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken, signal } from '@angular/core';
import { Observable } from 'rxjs';
import type { RuleTreePayload } from './rule-builder.model';

export interface EvaluateAudienceResponse {
  matches: { name: string; email: string }[];
}

export const AUDIENCE_RULES_API_BASE_URL = new InjectionToken<string>('AUDIENCE_RULES_API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000',
});

export interface CreateAudienceRuleRequest {
  name: string;
  root: RuleTreePayload.Group;
  savedAt?: string;
}

export interface SavedAudienceRule extends CreateAudienceRuleRequest {
  id: string;
  storedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudienceRulesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(AUDIENCE_RULES_API_BASE_URL);

  private readonly savedRulesListGeneration = signal(0);

  /** Read in an effect to reload the saved-rules list when this changes. */
  readonly savedRulesListVersion = this.savedRulesListGeneration.asReadonly();

  /** Call after a rule is persisted so the list UI can refetch. */
  notifyRuleSaved(): void {
    this.savedRulesListGeneration.update((n) => n + 1);
  }

  listRules(): Observable<SavedAudienceRule[]> {
    return this.http.get<SavedAudienceRule[]>(`${this.baseUrl}/rules`);
  }

  saveRule(body: CreateAudienceRuleRequest): Observable<SavedAudienceRule> {
    return this.http.post<SavedAudienceRule>(`${this.baseUrl}/rules`, body);
  }

  deleteRule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/rules/${encodeURIComponent(id)}`);
  }

  evaluateRule(body: { root: RuleTreePayload.Group }): Observable<EvaluateAudienceResponse> {
    return this.http.post<EvaluateAudienceResponse>(`${this.baseUrl}/evaluate`, body);
  }
}
