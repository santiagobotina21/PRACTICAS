import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosConvenioComponent } from './documentos-convenio.component';

describe('DocumentosConvenioComponent', () => {
  let component: DocumentosConvenioComponent;
  let fixture: ComponentFixture<DocumentosConvenioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentosConvenioComponent]
    });
    fixture = TestBed.createComponent(DocumentosConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
