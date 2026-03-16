import { TestBed } from '@angular/core/testing';

import { CvGestion } from './cv-gestion';

describe('CvGestion', () => {
  let service: CvGestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvGestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
