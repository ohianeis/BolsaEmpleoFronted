import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturasTabs } from './candidaturas-tabs';

describe('CandidaturasTabs', () => {
  let component: CandidaturasTabs;
  let fixture: ComponentFixture<CandidaturasTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidaturasTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturasTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
