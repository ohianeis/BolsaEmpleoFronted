import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatoPerfil } from './candidato-perfil';

describe('CandidatoPerfil', () => {
  let component: CandidatoPerfil;
  let fixture: ComponentFixture<CandidatoPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatoPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatoPerfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
