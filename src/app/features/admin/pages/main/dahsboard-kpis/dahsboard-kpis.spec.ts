import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DahsboardKPIs } from './dahsboard-kpis';

describe('DahsboardKPIs', () => {
  let component: DahsboardKPIs;
  let fixture: ComponentFixture<DahsboardKPIs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DahsboardKPIs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DahsboardKPIs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
