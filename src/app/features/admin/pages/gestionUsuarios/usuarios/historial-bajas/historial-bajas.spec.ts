import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialBajas } from './historial-bajas';

describe('HistorialBajas', () => {
  let component: HistorialBajas;
  let fixture: ComponentFixture<HistorialBajas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialBajas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialBajas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
