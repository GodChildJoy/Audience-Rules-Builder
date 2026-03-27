import { Component, inject } from '@angular/core';
import { RuleBuilderService } from '../rule-builder.service';

@Component({
  selector: 'app-audience-rules-header',
  imports: [],
  templateUrl: './audience-rules-header.html',
})
export class AudienceRulesHeader {
  private readonly ruleBuilder = inject(RuleBuilderService);

  protected onSave(): void {
    this.ruleBuilder.saveRule();
  }
}
