import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraciasComponent } from './gracias.component';

describe('GraciasComponent', () => {
  let component: GraciasComponent;
  let fixture: ComponentFixture<GraciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraciasComponent]
    });
    fixture = TestBed.createComponent(GraciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
