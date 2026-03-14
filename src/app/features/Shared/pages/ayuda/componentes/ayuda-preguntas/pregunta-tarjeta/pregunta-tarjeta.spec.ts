import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaTarjeta } from './pregunta-tarjeta';

describe('PreguntaTarjeta', () => {
  let component: PreguntaTarjeta;
  let fixture: ComponentFixture<PreguntaTarjeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaTarjeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaTarjeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
