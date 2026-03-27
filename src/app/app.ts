import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudienceRulesBuilder } from './audience-rules/audience-rules-builder/audience-rules-builder';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AudienceRulesBuilder],
  templateUrl: './app.html',
})
export class App {}
