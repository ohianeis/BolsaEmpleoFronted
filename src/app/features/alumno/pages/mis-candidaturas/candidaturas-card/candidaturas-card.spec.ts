import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturasCard } from './candidaturas-card';

describe('CandidaturasCard', () => {
  let component: CandidaturasCard;
  let fixture: ComponentFixture<CandidaturasCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidaturasCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturasCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
