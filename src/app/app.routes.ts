import { Routes } from '@angular/router';
import { AudienceRulesBuilder } from './audience-rules/audience-rules-builder/audience-rules-builder';

export const routes: Routes = [
  { path: '', component: AudienceRulesBuilder },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
