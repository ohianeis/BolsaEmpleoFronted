import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreOferta } from './cierre-oferta';

describe('CierreOferta', () => {
  let component: CierreOferta;
  let fixture: ComponentFixture<CierreOferta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CierreOferta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CierreOferta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
