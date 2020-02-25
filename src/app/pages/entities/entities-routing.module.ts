import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntitiesComponent } from './entities.component';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { IndicatorsListComponent } from './indicators-list/indicators-list.component';
import { IndicatorValuesListComponent } from './indicator-values-list/indicator-values-list.component';

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
      path: 'indicator-values',
      component: IndicatorValuesListComponent,
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
