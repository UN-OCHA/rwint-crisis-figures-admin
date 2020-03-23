import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiteCountriesListComponent } from './lite-countries-list.component';

describe('LiteCountriesListComponent', () => {
  let component: LiteCountriesListComponent;
  let fixture: ComponentFixture<LiteCountriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiteCountriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiteCountriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
