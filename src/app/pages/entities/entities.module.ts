import { NgModule } from '@angular/core';
import { DndModule } from 'ngx-drag-drop';
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
import { EntitiesGridComponent } from './entities-grid.component';
import { EntitiesFormComponent } from './entities-form.component';
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
import { TermsListComponent } from './terms-list/terms-list.component';
import { TermsListFilterComponent } from './terms-list/terms-list-filter.component';
import { TermsFormComponent } from './terms-form/terms-form.component';
import { LiteCountriesListComponent } from './lite-countries-list/lite-countries-list.component';
import { LiteTermsListComponent } from './lite-terms-list/lite-terms-list.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    DndModule,
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
    EntitiesGridComponent,
    EntitiesFormComponent,
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
    TermsListComponent,
    TermsListFilterComponent,
    TermsFormComponent,
    LiteCountriesListComponent,
    LiteTermsListComponent,
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
    TermsListComponent,
    TermsFormComponent,
  ],
  exports: [
    LiteCountriesListComponent,
  ],
})
export class EntitiesModule { }
