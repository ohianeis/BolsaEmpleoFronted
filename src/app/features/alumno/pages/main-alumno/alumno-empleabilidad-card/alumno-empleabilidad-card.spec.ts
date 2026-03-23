import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoEmpleabilidadCard } from './alumno-empleabilidad-card';

describe('AlumnoEmpleabilidadCard', () => {
  let component: AlumnoEmpleabilidadCard;
  let fixture: ComponentFixture<AlumnoEmpleabilidadCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoEmpleabilidadCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnoEmpleabilidadCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
