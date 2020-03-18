import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsFormComponent } from './terms-form.component';

describe('VocabularysFormComponent', () => {
  let component: TermsFormComponent;
  let fixture: ComponentFixture<TermsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsFormComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
