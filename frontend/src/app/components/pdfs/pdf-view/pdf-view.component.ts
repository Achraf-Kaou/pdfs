import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfService } from '../../../services/Pdf.service';
import PSPDFKit from 'pspdfkit';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit, OnChanges {
  @Input() pdfSrc!: Uint8Array;
  pdfDoc!: PDFDocument;

  constructor(private sanitizer: DomSanitizer, private pdfService: PdfService){}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfSrc'] && this.pdfSrc) {
      this.loadPdf();
    }
  }

  async loadPdf() {
    try {
      const arrayBuffer = this.pdfSrc.buffer; // Convert Uint8Array to ArrayBuffer
      await PSPDFKit.load({
        baseUrl: location.protocol + "//" + location.host + "/assets/",
        document: arrayBuffer, // Use ArrayBuffer here
        container: "#pspdfkit-container",
      }).then(instance => {
        instance.setViewState(viewState => viewState.set("sidebarMode", PSPDFKit.SidebarMode.THUMBNAILS));
        (window as any).instance = instance;
      });
    } catch (error) {
      console.error('Error loading PSPDFKit', error);
    }
  }
}