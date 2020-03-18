import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabulariesListFilterComponent } from './vocabularies-list-filter.component';

describe('VocabulariesListFilterComponent', () => {
  let component: VocabulariesListFilterComponent;
  let fixture: ComponentFixture<VocabulariesListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabulariesListFilterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabulariesListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
