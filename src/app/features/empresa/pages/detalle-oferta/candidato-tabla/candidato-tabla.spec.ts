import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatoTabla } from './candidato-tabla';

describe('CandidatoTabla', () => {
  let component: CandidatoTabla;
  let fixture: ComponentFixture<CandidatoTabla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatoTabla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatoTabla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
