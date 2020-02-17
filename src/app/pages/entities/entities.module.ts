import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '@theme/theme.module';
import { EntitiesRoutingModule, routedComponents } from './entities-routing.module';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { CountriesFormComponent } from './countries-form/countries-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ThemeModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbDialogModule.forChild(),
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbTooltipModule,
    NgxDatatableModule,
    EntitiesRoutingModule,
  ],
  declarations: [
    ...routedComponents,
    CountriesListComponent,
    CountriesFormComponent,
  ],
  entryComponents: [
    CountriesListComponent,
    CountriesFormComponent,
  ],
})
export class EntitiesModule { }
