import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionDocumentosJComponent } from './revision-documentos-j.component';

describe('RevisionDocumentosJComponent', () => {
  let component: RevisionDocumentosJComponent;
  let fixture: ComponentFixture<RevisionDocumentosJComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionDocumentosJComponent]
    });
    fixture = TestBed.createComponent(RevisionDocumentosJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
