import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEmpresas } from './tabla-empresas';

describe('TablaEmpresas', () => {
  let component: TablaEmpresas;
  let fixture: ComponentFixture<TablaEmpresas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEmpresas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEmpresas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
