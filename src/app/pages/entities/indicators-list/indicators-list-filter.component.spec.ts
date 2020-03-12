import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsListFilterComponent } from './indicators-list-filter.component';

describe('IndicatorsListFilterComponent', () => {
  let component: IndicatorsListFilterComponent;
  let fixture: ComponentFixture<IndicatorsListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorsListFilterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
