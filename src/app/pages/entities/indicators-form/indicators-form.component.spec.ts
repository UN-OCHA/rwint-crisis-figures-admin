import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsFormComponent } from './indicators-form.component';

describe('IndicatorsFormComponent', () => {
  let component: IndicatorsFormComponent;
  let fixture: ComponentFixture<IndicatorsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
