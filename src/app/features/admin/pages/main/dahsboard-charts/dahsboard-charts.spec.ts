import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DahsboardCharts } from './dahsboard-charts';

describe('DahsboardCharts', () => {
  let component: DahsboardCharts;
  let fixture: ComponentFixture<DahsboardCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DahsboardCharts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DahsboardCharts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
