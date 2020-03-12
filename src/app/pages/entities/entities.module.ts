import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NbMomentDateModule } from '@nebular/moment';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '@theme/theme.module';
import { EntitiesRoutingModule, routedComponents } from './entities-routing.module';
import { BaseComponent } from '@pages/entities/base.component';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { CountriesFormComponent } from './countries-form/countries-form.component';
import { IndicatorsListComponent } from './indicators-list/indicators-list.component';
import { IndicatorsFormComponent } from './indicators-form/indicators-form.component';
import { IndicatorValuesListComponent } from './indicator-values-list/indicator-values-list.component';
import { IndicatorValuesListFilterComponent } from './indicator-values-list/indicator-values-list-filter.component';
import { IndicatorValuesFormComponent } from './indicator-values-form/indicator-values-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ThemeModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbMomentDateModule,
    NbDialogModule.forChild(),
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbTooltipModule,
    NgxDatatableModule,
    NgbTypeaheadModule,
    EntitiesRoutingModule,
  ],
  declarations: [
    ...routedComponents,
    BaseComponent,
    CountriesListComponent,
    CountriesFormComponent,
    IndicatorsListComponent,
    IndicatorsFormComponent,
    IndicatorValuesListComponent,
    IndicatorValuesListFilterComponent,
    IndicatorValuesFormComponent,
  ],
  entryComponents: [
    CountriesListComponent,
    CountriesFormComponent,
    IndicatorsListComponent,
    IndicatorsFormComponent,
    IndicatorValuesListComponent,
    IndicatorValuesFormComponent,
  ],
})
export class EntitiesModule { }
