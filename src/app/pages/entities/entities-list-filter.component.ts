import { EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { FormGroup } from '@angular/forms';

/**
 * Base list filtering component for all entities.
 */
export abstract class EntitiesListFilterComponent<T = Params> implements OnInit {
  /** */
  @Input()
  filters: Params;

  /** */
  @Output()
  onChange: EventEmitter<Params>;

  // // //  Props
  form: FormGroup;

  /** Constructor */
  protected constructor(injector: Injector) {
    this.onChange = new EventEmitter();
  }

  /** @override */
  ngOnInit(): void {

  }

  onSubmit($event: {}) {

  }
}
