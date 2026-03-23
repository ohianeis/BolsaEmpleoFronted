import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoChart } from './alumno-chart';

describe('AlumnoChart', () => {
  let component: AlumnoChart;
  let fixture: ComponentFixture<AlumnoChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnoChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
