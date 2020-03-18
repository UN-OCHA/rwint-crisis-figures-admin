import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntitiesComponent } from './entities.component';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { IndicatorsListComponent } from './indicators-list/indicators-list.component';
import { IndicatorValuesListComponent } from './indicator-values-list/indicator-values-list.component';
import { VocabulariesListComponent } from './vocabularies-list/vocabularies-list.component';
import { TermsListComponent } from './terms-list/terms-list.component';

const routes: Routes = [{
  path: '',
  component: EntitiesComponent,
  children: [
    {
      path: 'countries',
      component: CountriesListComponent,
    },
    {
      path: 'indicators',
      component: IndicatorsListComponent,
    },
    {
      path: 'indicators/:id/values',
      component: IndicatorValuesListComponent,
    },
    {
      path: 'vocabularies',
      component: VocabulariesListComponent,
    },
    {
      path: 'vocabularies/:id/terms',
      component: TermsListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule { }

export const routedComponents = [
  EntitiesComponent,
  CountriesListComponent,
];
