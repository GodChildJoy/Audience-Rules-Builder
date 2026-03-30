import { Component, inject } from '@angular/core';
import { AudienceRulesHeader } from '../audience-rules-header/audience-rules-header';
import { AudienceRulesList } from '../audience-rules-list/audience-rules-list';
import { MatchingContacts } from '../matching-contacts/matching-contacts';
import { RuleGroupComponent } from '../rule-group/rule-group';
import { RuleBuilderService } from '../rule-builder.service';

@Component({
  selector: 'app-audience-rules-builder',
  imports: [AudienceRulesHeader, AudienceRulesList, MatchingContacts, RuleGroupComponent],
  templateUrl: './audience-rules-builder.html',
})
export class AudienceRulesBuilder {
  private readonly ruleBuilder = inject(RuleBuilderService);
  protected readonly root = this.ruleBuilder.root;

  protected addRootCondition(): void {
    this.ruleBuilder.addCondition(this.root().id);
  }

  protected addRootGroup(): void {
    this.ruleBuilder.addGroup(this.root().id);
  }
}
