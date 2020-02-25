import { Component, Injector, OnInit } from '@angular/core';
import { IndicatorValueService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { IndicatorValue } from '@core/api/entities/indicator-value';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { IndicatorValuesFormComponent } from '@pages/entities/indicator-values-form/indicator-values-form.component';

@Component({
  selector: 'ngx-indicator-values-list',
  templateUrl: './indicator-values-list.component.html',
  styleUrls: ['./indicator-values-list.component.scss'],
})
export class IndicatorValuesListComponent extends EntitiesListComponent<IndicatorValue> implements OnInit {

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: IndicatorValueService) {
    super(injector);
    this.entityFormComponent = IndicatorValuesFormComponent;
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor(): EntityConstructor<IndicatorValue> {
    return IndicatorValue;
  }
}
