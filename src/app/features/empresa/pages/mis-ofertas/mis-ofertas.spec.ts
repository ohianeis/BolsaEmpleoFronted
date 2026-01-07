import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisOfertas } from './mis-ofertas';

describe('MisOfertas', () => {
  let component: MisOfertas;
  let fixture: ComponentFixture<MisOfertas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisOfertas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisOfertas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
