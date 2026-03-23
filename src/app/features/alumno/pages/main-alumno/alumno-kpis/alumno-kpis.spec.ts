import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoKpis } from './alumno-kpis';

describe('AlumnoKpis', () => {
  let component: AlumnoKpis;
  let fixture: ComponentFixture<AlumnoKpis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoKpis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnoKpis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
