import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaContacto } from './ayuda-contacto';

describe('AyudaContacto', () => {
  let component: AyudaContacto;
  let fixture: ComponentFixture<AyudaContacto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaContacto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudaContacto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
