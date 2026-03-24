import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaSkeleton } from './oferta-skeleton';

describe('OfertaSkeleton', () => {
  let component: OfertaSkeleton;
  let fixture: ComponentFixture<OfertaSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
