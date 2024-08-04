import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfEditContentComponent } from './pdf-edit-content.component';

describe('PdfEditContentComponent', () => {
  let component: PdfEditContentComponent;
  let fixture: ComponentFixture<PdfEditContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfEditContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfEditContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
