import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPdfsComponent } from './formulario-pdfs.component';

describe('FormularioPdfsComponent', () => {
  let component: FormularioPdfsComponent;
  let fixture: ComponentFixture<FormularioPdfsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioPdfsComponent]
    });
    fixture = TestBed.createComponent(FormularioPdfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
