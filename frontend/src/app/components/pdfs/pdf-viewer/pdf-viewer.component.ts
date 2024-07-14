import { Component, Input } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent {
  @Input() pdfSrc!: Uint8Array;

  onAfterLoadComplete(pdf: any) {
    pdf.annotationToolbar.setToolbarVisible(false);
  }

}
