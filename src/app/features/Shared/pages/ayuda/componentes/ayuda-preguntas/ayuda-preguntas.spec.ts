import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaPreguntas } from './ayuda-preguntas';

describe('AyudaPreguntas', () => {
  let component: AyudaPreguntas;
  let fixture: ComponentFixture<AyudaPreguntas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaPreguntas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudaPreguntas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
