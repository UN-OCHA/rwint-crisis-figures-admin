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
  ],
  entryComponents: [
  ],
})
export class EntitiesModule { }
