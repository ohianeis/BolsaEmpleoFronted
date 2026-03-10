import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOferta } from './form-oferta';

describe('FormOferta', () => {
  let component: FormOferta;
  let fixture: ComponentFixture<FormOferta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOferta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOferta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
