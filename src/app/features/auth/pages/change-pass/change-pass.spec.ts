import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePass } from './change-pass';

describe('ChangePass', () => {
  let component: ChangePass;
  let fixture: ComponentFixture<ChangePass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
