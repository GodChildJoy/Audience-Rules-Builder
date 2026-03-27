import { Component, output } from '@angular/core';

@Component({
  selector: 'app-audience-rules-header',
  imports: [],
  templateUrl: './audience-rules-header.html',
})
export class AudienceRulesHeader {
  readonly save = output<void>();
}
