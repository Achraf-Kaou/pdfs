import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfDeleteComponent } from './pdf-delete.component';

describe('PdfDeleteComponent', () => {
  let component: PdfDeleteComponent;
  let fixture: ComponentFixture<PdfDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
