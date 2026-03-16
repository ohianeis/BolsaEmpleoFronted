import { TestBed } from '@angular/core/testing';

import { PaginacionBase } from './paginacion-base';

describe('PaginacionBase', () => {
  let service: PaginacionBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginacionBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
