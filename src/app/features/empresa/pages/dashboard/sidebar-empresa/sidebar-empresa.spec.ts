import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEmpresa } from './sidebar-empresa';

describe('SidebarEmpresa', () => {
  let component: SidebarEmpresa;
  let fixture: ComponentFixture<SidebarEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
