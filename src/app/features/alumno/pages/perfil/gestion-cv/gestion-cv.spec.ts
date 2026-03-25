import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCv } from './gestion-cv';

describe('GestionCv', () => {
  let component: GestionCv;
  let fixture: ComponentFixture<GestionCv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
