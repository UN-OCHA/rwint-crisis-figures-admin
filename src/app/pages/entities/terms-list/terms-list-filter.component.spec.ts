import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsListFilterComponent } from './terms-list-filter.component';

describe('TermsListFilterComponent', () => {
  let component: TermsListFilterComponent;
  let fixture: ComponentFixture<TermsListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsListFilterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
