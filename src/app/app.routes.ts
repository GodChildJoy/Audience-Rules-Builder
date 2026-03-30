import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./audience-rules/audience-rules-builder/audience-rules-builder').then(
        (m) => m.AudienceRulesBuilder,
      ),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
