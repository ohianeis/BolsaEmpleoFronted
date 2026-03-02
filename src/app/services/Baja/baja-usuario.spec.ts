import { TestBed } from '@angular/core/testing';

import { BajaUsuario } from './baja-usuario';

describe('BajaUsuario', () => {
  let service: BajaUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BajaUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
