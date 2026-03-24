import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaDetalle } from './oferta-detalle';

describe('OfertaDetalle', () => {
  let component: OfertaDetalle;
  let fixture: ComponentFixture<OfertaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
