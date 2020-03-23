import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';
import isNumber from 'lodash/isNumber';
import { TermService, VocabularyService } from '@core/api';
import { EntityConstructor } from '@core/api/types';
import { Term } from '@core/api/entities/term';
import { EntitiesGridComponent } from '@pages/entities/entities-grid.component';
import { TermsFormComponent } from '@pages/entities/terms-form/terms-form.component';
import { idFromIri, isIri } from '@core/utils/entity.util';
import { HttpParams } from '@angular/common/http';
import { Vocabulary } from '@core/api/entities/vocabulary';

@Component({
  selector: 'ngx-terms-list',
  templateUrl: './terms-list.component.html',
  styleUrls: ['./terms-list.component.scss'],
})
export class TermsListComponent extends EntitiesGridComponent<Term> implements OnInit {

  /** Related `Vocabulary` instance */
  vocabulary?: Vocabulary;

  /** Constructor */
  constructor(protected injector: Injector,
              protected entityService: TermService,
              protected vocabularyService: VocabularyService) {
    super(injector);
    this.entityFormComponent = TermsFormComponent;
  }

  /** @override */
  protected onRouteChange(event): void {
    // Validate route parameter representing Vocabulary ID and load it
    if (this.route.snapshot.params.id) {
      // Load `Vocabulary` instance using `id` param
      this.loadVocabulary(Number(this.route.snapshot.params.id));
      // Filter list by aforementioned `Vocabulary` ID
      this.requiredFilters['vocabulary.id'] = this.route.snapshot.params.id;
    }

    super.onRouteChange(event);
  }

  /** @override */
  ngOnInit(): void {
    super.ngOnInit();
  }

  /**
   * Load related `Vocabulary` instance.
   *
   * @param vocabularyId
   */
  protected loadVocabulary(vocabularyId: number) {
    const params = new HttpParams();

    this.vocabularyService.one(vocabularyId, params).subscribe(responseCtx => {
      this.vocabulary = responseCtx.body;
    });
  }

  /** @override */
  protected buildEntityFormDialogContext(entity?: Term): any {
    const context = super.buildEntityFormDialogContext(entity);
    if (this.vocabulary) {
      context.prepopulatedProps = {
        vocabulary: this.vocabulary,
      };
    }

    return context;
  }

  /** @override */
  getEntityConstructor(): EntityConstructor<Term> {
    return Term;
  }
}
