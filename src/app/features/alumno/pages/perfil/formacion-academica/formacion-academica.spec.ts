import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormacionAcademica } from './formacion-academica';

describe('FormacionAcademica', () => {
  let component: FormacionAcademica;
  let fixture: ComponentFixture<FormacionAcademica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormacionAcademica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormacionAcademica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
