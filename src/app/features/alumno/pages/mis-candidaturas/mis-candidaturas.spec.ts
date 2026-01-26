import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCandidaturas } from './mis-candidaturas';

describe('MisCandidaturas', () => {
  let component: MisCandidaturas;
  let fixture: ComponentFixture<MisCandidaturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCandidaturas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisCandidaturas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
