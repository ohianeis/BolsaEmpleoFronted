import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Talento } from './talento';

describe('Talento', () => {
  let component: Talento;
  let fixture: ComponentFixture<Talento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Talento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Talento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
