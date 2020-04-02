import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiteTermsListComponent } from './lite-terms-list.component';

describe('LiteTermsListComponent', () => {
  let component: LiteTermsListComponent;
  let fixture: ComponentFixture<LiteTermsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiteTermsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiteTermsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
