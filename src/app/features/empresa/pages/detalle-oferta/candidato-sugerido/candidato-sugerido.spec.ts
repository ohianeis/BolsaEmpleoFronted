import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatoSugerido } from './candidato-sugerido';

describe('CandidatoSugerido', () => {
  let component: CandidatoSugerido;
  let fixture: ComponentFixture<CandidatoSugerido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatoSugerido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatoSugerido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
