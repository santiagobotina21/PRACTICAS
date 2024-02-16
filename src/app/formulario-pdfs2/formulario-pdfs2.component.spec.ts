import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPdfs2Component } from './formulario-pdfs2.component';

describe('FormularioPdfs2Component', () => {
  let component: FormularioPdfs2Component;
  let fixture: ComponentFixture<FormularioPdfs2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioPdfs2Component]
    });
    fixture = TestBed.createComponent(FormularioPdfs2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
