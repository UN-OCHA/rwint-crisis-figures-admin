import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorValuesListComponent } from './indicator-values-list.component';

describe('IndicatorValuesListComponent', () => {
  let component: IndicatorValuesListComponent;
  let fixture: ComponentFixture<IndicatorValuesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorValuesListComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorValuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
