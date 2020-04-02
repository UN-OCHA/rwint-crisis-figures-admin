import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EntitiesListComponent } from '@pages/entities/entities-list.component';
import { Term } from '@core/api/entities/term';
import { TermService } from '@core/api';
import { DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'ngx-lite-terms-list',
  templateUrl: './lite-terms-list.component.html',
  styleUrls: ['./lite-terms-list.component.scss'],
})
export class LiteTermsListComponent extends EntitiesListComponent<Term> implements OnInit {

  /** Filtered list of terms */
  filteredTerms: Term[];
  /** Filter form instance */
  listFilterForm: FormGroup;
  /** Always sort grid by `weight` in descending order */
  requiredSorts = {
    'name': 'asc',
  };

  /** Constructor */
  constructor(injector: Injector,
              protected formBuilder: FormBuilder,
              protected entityService: TermService) {
    super(injector);

    // Build term search form
    this.listFilterForm = this.formBuilder.group({
      'name': [''],
    });
  }

  /** @override */
  ngOnInit() {
    super.ngOnInit();
    this.setRequestParams();

    // Track changes to the search field to filter the terms list
    this.observe(
      this.entityService.acSearch(this.name.valueChanges, undefined, this.listRequestParams)
    ).subscribe({
      next: (terms: Term[]) => {
        this.preprocessList(terms);
      },
    });
  }

  /** @override */
  protected preprocessList(list: Term[]): Term[] {
    // Since the fetching occurs only once thoughout the component's lifecycle,
    // cone fetched `terms` as the `filteredTerms` list.
    const terms = super.preprocessList(list);
    this.filteredTerms = [...terms];
    return terms;
  }

  // // //  Accessors

  get name() {
    return this.listFilterForm.get('name');
  }

  // // // Event Handlers

  onDragStart(event: DragEvent) {
    console.log('onDragStart:', event);
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    console.log(`onDragged: Drag ended with effect "${effect}"`);
  }

  onDragEnd(event: DragEvent) {
    console.log('onDragEnd:', event);
  }
}

