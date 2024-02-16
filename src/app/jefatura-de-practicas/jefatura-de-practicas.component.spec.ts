import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefaturaDePracticasComponent } from './jefatura-de-practicas.component';

describe('JefaturaDePracticasComponent', () => {
  let component: JefaturaDePracticasComponent;
  let fixture: ComponentFixture<JefaturaDePracticasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JefaturaDePracticasComponent]
    });
    fixture = TestBed.createComponent(JefaturaDePracticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
