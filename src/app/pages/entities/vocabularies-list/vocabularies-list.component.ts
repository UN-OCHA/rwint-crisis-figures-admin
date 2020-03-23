import { Component, Injector, OnInit } from '@angular/core';
import { VocabularyService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { Vocabulary } from '@core/api/entities/vocabulary';
import { EntitiesGridComponent } from '@pages/entities/entities-grid.component';
import { VocabulariesFormComponent } from '@pages/entities/vocabularies-form/vocabularies-form.component';

@Component({
  selector: 'ngx-vocabularies-list',
  templateUrl: './vocabularies-list.component.html',
  styleUrls: ['./vocabularies-list.component.scss'],
})
export class VocabulariesListComponent extends EntitiesGridComponent<Vocabulary> implements OnInit {

  /** Embed countries and latest values in list response */
  requiredFilters = {
    'with[]': ['country', 'values'],
    'preset': 'latest',
  };

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: VocabularyService) {
    super(injector);
    this.entityFormComponent = VocabulariesFormComponent;
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  getEntityConstructor(): EntityConstructor<Vocabulary> {
    return Vocabulary;
  }
}
