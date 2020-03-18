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
import { EntitiesListComponent } from './entities-list.component';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { CountriesFormComponent } from './countries-form/countries-form.component';
import { IndicatorsListComponent } from './indicators-list/indicators-list.component';
import { IndicatorsListFilterComponent } from './indicators-list/indicators-list-filter.component';
import { IndicatorsFormComponent } from './indicators-form/indicators-form.component';
import { IndicatorValuesListComponent } from './indicator-values-list/indicator-values-list.component';
import { IndicatorValuesListFilterComponent } from './indicator-values-list/indicator-values-list-filter.component';
import { IndicatorValuesFormComponent } from './indicator-values-form/indicator-values-form.component';
import { VocabulariesListComponent } from './vocabularies-list/vocabularies-list.component';
import { VocabulariesListFilterComponent } from './vocabularies-list/vocabularies-list-filter.component';
import { VocabulariesFormComponent } from './vocabularies-form/vocabularies-form.component';
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
    EntitiesListComponent,
    CountriesListComponent,
    CountriesFormComponent,
    IndicatorsListComponent,
    IndicatorsListFilterComponent,
    IndicatorsFormComponent,
    IndicatorValuesListComponent,
    IndicatorValuesListFilterComponent,
    IndicatorValuesFormComponent,
    VocabulariesListComponent,
    VocabulariesListFilterComponent,
    VocabulariesFormComponent,
  ],
  entryComponents: [
    CountriesListComponent,
    CountriesFormComponent,
    IndicatorsListComponent,
    IndicatorsFormComponent,
    IndicatorValuesListComponent,
    IndicatorValuesFormComponent,
    VocabulariesListComponent,
    VocabulariesFormComponent,
  ],
})
export class EntitiesModule { }
