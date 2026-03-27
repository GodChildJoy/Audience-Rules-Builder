import { Component, signal } from '@angular/core';
import { AudienceRulesHeader } from '../audience-rules-header/audience-rules-header';
import { RuleGroupComponent } from '../rule-group/rule-group';
import { createCondition, createRuleGroup, type RuleGroup } from '../rule-builder.model';

@Component({
  selector: 'app-audience-rules-builder',
  imports: [AudienceRulesHeader, RuleGroupComponent],
  templateUrl: './audience-rules-builder.html',
  styleUrl: './audience-rules-builder.css',
})
export class AudienceRulesBuilder {
  /** Root rule tree; nested groups render recursively inside `app-rule-group`. */
  protected readonly root = signal<RuleGroup>(this.initialRoot());

  private initialRoot(): RuleGroup {
    const nested = createRuleGroup(false);
    return {
      id: crypto.randomUUID(),
      logic: 'AND',
      conditions: [createCondition()],
      groups: [nested],
    };
  }

  protected onRootChange(next: RuleGroup): void {
    this.root.set(next);
  }

  protected addRootCondition(): void {
    const g = this.root();
    this.root.set({ ...g, conditions: [...g.conditions, createCondition()] });
  }

  protected addRootGroup(): void {
    const g = this.root();
    this.root.set({ ...g, groups: [...g.groups, createRuleGroup(true)] });
  }

  protected onSave(): void {
    console.log('Audience rule payload', this.root());
  }
}
