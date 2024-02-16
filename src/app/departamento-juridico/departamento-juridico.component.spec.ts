import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoJuridicoComponent } from './departamento-juridico.component';

describe('DepartamentoJuridicoComponent', () => {
  let component: DepartamentoJuridicoComponent;
  let fixture: ComponentFixture<DepartamentoJuridicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartamentoJuridicoComponent]
    });
    fixture = TestBed.createComponent(DepartamentoJuridicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
