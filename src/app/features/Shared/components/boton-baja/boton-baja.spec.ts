import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonBaja } from './boton-baja';

describe('BotonBaja', () => {
  let component: BotonBaja;
  let fixture: ComponentFixture<BotonBaja>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonBaja]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonBaja);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
