import { EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Entity } from '@core/api/entities/entity';
import { FormGroup } from '@angular/forms';

export abstract class EntitiesListFilterComponent<T extends Entity> implements OnInit {
  /** */
  @Input()
  filterEntity: T;

  /** */
  @Output()
  onChange: EventEmitter<T>;

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
