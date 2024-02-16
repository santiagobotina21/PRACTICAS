import { TestBed } from '@angular/core/testing';

import { LlamarDatosService } from './llamar-datos.service';

describe('LlamarDatosService', () => {
  let service: LlamarDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamarDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
