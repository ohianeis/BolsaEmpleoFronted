import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaPasos } from './ayuda-pasos';

describe('AyudaPasos', () => {
  let component: AyudaPasos;
  let fixture: ComponentFixture<AyudaPasos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaPasos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudaPasos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
