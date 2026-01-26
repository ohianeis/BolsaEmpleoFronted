import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAlumno } from './main-alumno';

describe('MainAlumno', () => {
  let component: MainAlumno;
  let fixture: ComponentFixture<MainAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
