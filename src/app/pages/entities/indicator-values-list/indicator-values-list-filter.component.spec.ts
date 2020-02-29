import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorValuesListFilterComponent } from './indicator-values-list-filter.component';

describe('IndicatorValuesListFilterComponent', () => {
  let component: IndicatorValuesListFilterComponent;
  let fixture: ComponentFixture<IndicatorValuesListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorValuesListFilterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorValuesListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
