import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEmpresa } from './main-empresa';

describe('MainEmpresa', () => {
  let component: MainEmpresa;
  let fixture: ComponentFixture<MainEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
