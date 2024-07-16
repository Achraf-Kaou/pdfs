import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfService } from '../../../services/Pdf.service';
import PSPDFKit from 'pspdfkit';
import { User } from '../../../models/User';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit, OnChanges  {
  @Input() pdfSrc!: Uint8Array;
  pdfDoc!: PDFDocument;
  instance: any;
  idUser!: string;
  @Input() idPdf!: string | null;
  constructor(private sanitizer: DomSanitizer, private pdfService: PdfService){}

  ngOnInit(): void {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfSrc'] && this.pdfSrc) {
      this.loadPdf();
    }
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user && user.id) {
        this.idUser= user.id as string;
      }
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
        this.instance = instance;
        instance.setViewState(viewState => viewState.set("sidebarMode", PSPDFKit.SidebarMode.THUMBNAILS));
        (window as any).instance = instance;
      });
    } catch (error) {
      console.error('Error loading PSPDFKit', error);
    }
  }


  

  savePdf() {
    this.instance.exportPDF().then((pdfArrayBuffer: ArrayBuffer) => {
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
      const formData = new FormData();
      const blob = new Blob([pdfUint8Array], { type: 'application/pdf' });
      formData.append('file', blob, 'document.pdf');
      formData.append('user', this.idUser);
      this.pdfService.updatePdf(formData, this.idPdf).subscribe(response => {
        console.log('PDF saved successfully', response);
      });
    });
  }

}