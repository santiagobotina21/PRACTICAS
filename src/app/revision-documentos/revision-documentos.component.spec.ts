import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionDocumentosComponent } from './revision-documentos.component';

describe('RevisionDocumentosComponent', () => {
  let component: RevisionDocumentosComponent;
  let fixture: ComponentFixture<RevisionDocumentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionDocumentosComponent]
    });
    fixture = TestBed.createComponent(RevisionDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
