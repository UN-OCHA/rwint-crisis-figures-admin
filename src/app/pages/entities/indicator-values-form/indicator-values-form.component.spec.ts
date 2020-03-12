import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorValuesFormComponent } from './indicator-values-form.component';

describe('IndicatorsFormComponent', () => {
  let component: IndicatorValuesFormComponent;
  let fixture: ComponentFixture<IndicatorValuesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorValuesFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorValuesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
