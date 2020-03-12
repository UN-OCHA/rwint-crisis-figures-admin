import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';
import isNumber from 'lodash/isNumber';
import { IndicatorValueService, IndicatorService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { IndicatorValue } from '@core/api/entities/indicator-value';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { IndicatorValuesFormComponent } from '@pages/entities/indicator-values-form/indicator-values-form.component';
import { idFromIri, isIri } from '@core/utils/entity.util';
import { HttpParams } from '@angular/common/http';
import { Indicator } from '@core/api/entities/indicator';

@Component({
  selector: 'ngx-indicator-values-list',
  templateUrl: './indicator-values-list.component.html',
  styleUrls: ['./indicator-values-list.component.scss'],
})
export class IndicatorValuesListComponent extends EntitiesListComponent<IndicatorValue> implements OnInit {

  /** Related `Indicator` instance */
  indicator?: Indicator;

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: IndicatorValueService,
              protected indicatorService: IndicatorService) {
    super(injector);
    this.entityFormComponent = IndicatorValuesFormComponent;
  }

  /** @override */
  protected onRouteChange(event): void {
    // Validate route parameter representing Indicator ID and load it
    if (this.route.snapshot.params.id) {
      // Load `Indicator` instance using `id` param
      this.loadIndicator(Number(this.route.snapshot.params.id));
      // Filter list by aforementioned `Indicator` ID
      this.requiredFilters['indicator.id'] = this.route.snapshot.params.id;
    }

    super.onRouteChange(event);
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Load related `Indicator` instance.
   *
   * @param indicatorId
   */
  protected loadIndicator(indicatorId: number) {
    const params = new HttpParams().set('with[]', 'country');

    this.indicatorService.one(indicatorId, params).subscribe(responseCtx => {
      this.indicator = responseCtx.body;
    });
  }

  /** @override */
  protected preprocessList(list: IndicatorValue[]): IndicatorValue[] {
    return super.preprocessList(list).map(indicatorValue => {
      // Add commas to numerical value
      indicatorValue.value = indicatorValue.value.toLocaleString();
      // Format date for display in listings
      indicatorValue.date = moment(indicatorValue.date).format('YYYY-MM-DD');
      return indicatorValue;
    });
  }

  /** @override */
  protected buildEntityFormDialogContext(entity?: IndicatorValue): any {
    const context = super.buildEntityFormDialogContext(entity);
    if (this.indicator) {
      context.prepopulatedProps = {
        indicator: this.indicator,
      };
    }

    return context;
  }

  /** @override */
  getEntityConstructor(): EntityConstructor<IndicatorValue> {
    return IndicatorValue;
  }
}
