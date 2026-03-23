import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablasAlertas } from './tablas-alertas';

describe('TablasAlertas', () => {
  let component: TablasAlertas;
  let fixture: ComponentFixture<TablasAlertas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablasAlertas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablasAlertas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
