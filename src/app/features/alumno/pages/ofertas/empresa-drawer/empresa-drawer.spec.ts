import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaDrawer } from './empresa-drawer';

describe('EmpresaDrawer', () => {
  let component: EmpresaDrawer;
  let fixture: ComponentFixture<EmpresaDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
