import { Component, Injector, OnInit } from '@angular/core';
import { IndicatorService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { Indicator } from '@core/api/entities/indicator';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { IndicatorsFormComponent } from '@pages/entities/indicators-form/indicators-form.component';
import { interval } from 'rxjs';

@Component({
  selector: 'ngx-indicators-list',
  templateUrl: './indicators-list.component.html',
  styleUrls: ['./indicators-list.component.scss'],
})
export class IndicatorsListComponent extends EntitiesListComponent<Indicator> implements OnInit {

  /** Embed countries and latest values in list response */
  requiredFilters = {
    'with[]': ['country', 'values'],
    'preset': 'latest',
  };

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: IndicatorService) {
    super(injector);
    this.entityFormComponent = IndicatorsFormComponent;
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor(): EntityConstructor<Indicator> {
    return Indicator;
  }
}
