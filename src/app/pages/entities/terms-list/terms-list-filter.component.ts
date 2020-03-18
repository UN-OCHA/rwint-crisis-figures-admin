import { Component, Injector, Input, OnInit } from '@angular/core';
import { Term } from '@core/api/entities/term';
import { Vocabulary } from '@core/api/entities/vocabulary';
import { EntitiesListFilterComponent } from '@pages/entities/entities-list-filter.component';

@Component({
  selector: 'ngx-terms-list-filter',
  templateUrl: './terms-list-filter.component.html',
  styleUrls: ['./terms-list-filter.component.scss'],
})
export class TermsListFilterComponent extends EntitiesListFilterComponent<Term> implements OnInit {

  /** Related `Vocabulary` instance */
  @Input()
  vocabulary: Vocabulary;

  /** Constructor */
  constructor(protected injector: Injector) {
    super(injector);
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }
}
