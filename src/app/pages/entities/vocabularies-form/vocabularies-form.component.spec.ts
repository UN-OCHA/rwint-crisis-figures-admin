import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabulariesFormComponent } from './vocabularies-form.component';

describe('VocabulariesFormComponent', () => {
  let component: VocabulariesFormComponent;
  let fixture: ComponentFixture<VocabulariesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabulariesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabulariesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
