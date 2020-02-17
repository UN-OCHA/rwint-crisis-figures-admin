import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntitiesComponent } from './entities.component';
import { NotFoundComponent } from '@pages/miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: EntitiesComponent,
  children: [],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitiesRoutingModule { }

export const routedComponents = [
  EntitiesComponent,
];
