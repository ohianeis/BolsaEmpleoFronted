import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAlumnos } from './tabla-alumnos';

describe('TablaAlumnos', () => {
  let component: TablaAlumnos;
  let fixture: ComponentFixture<TablaAlumnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaAlumnos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaAlumnos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
