import { Component, Injector, Input, OnInit } from '@angular/core';
import { IndicatorValue } from '@core/api/entities/indicator-value';
import { Indicator } from '@core/api/entities/indicator';
import { EntitiesListFilterComponent } from '@pages/entities/entities-list-filter.component';

@Component({
  selector: 'ngx-indicator-values-list-filter',
  templateUrl: './indicator-values-list-filter.component.html',
  styleUrls: ['./indicator-values-list-filter.component.scss'],
})
export class IndicatorValuesListFilterComponent extends EntitiesListFilterComponent<IndicatorValue> implements OnInit {

  /** Related `Indicator` instance */
  @Input()
  indicator: Indicator;

  /** Constructor */
  constructor(protected injector: Injector) {
    super(injector);
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }
}
