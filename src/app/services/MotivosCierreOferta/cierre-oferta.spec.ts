import { TestBed } from '@angular/core/testing';

import { CierreOferta } from './cierre-oferta';

describe('CierreOferta', () => {
  let service: CierreOferta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CierreOferta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
