import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilInfo } from './perfil-info';

describe('PerfilInfo', () => {
  let component: PerfilInfo;
  let fixture: ComponentFixture<PerfilInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
