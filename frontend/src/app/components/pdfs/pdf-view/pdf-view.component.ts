import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfService } from '../../../services/Pdf.service';
import { User } from '../../../models/User';

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
  idUser!: string;
  @Input() idPdf!: string | null;
  pdfSource!: any;
  constructor(private sanitizer: DomSanitizer, private pdfService: PdfService, private ngxService: NgxExtendedPdfViewerService){}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user && user.id) {
        this.idUser= user.id as string;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfSrc'] && this.pdfSrc) {
      console.log("oui")
      const uint8Array = this.pdfSrc as Uint8Array;
      this.pdfSource = new Blob([uint8Array], { type: 'application/pdf' });
    }
  }

  savePdf(modifiedPdf: Blob) {
    const formData = new FormData();
    formData.append('file', modifiedPdf);
    formData.append('user', this.idUser);
    this.pdfService.updatePdf(formData, this.idPdf).subscribe(response => {
      console.log('PDF saved successfully', response);
    });
  }

  exportPdf() {
    this.ngxService.getCurrentDocumentAsBlob().then((blob: Blob | undefined) => {
      if (blob) {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('user', this.idUser);

        this.pdfService.updatePdf(formData, this.idPdf).subscribe(response => {
          console.log('PDF saved successfully', response);
        })
  
          }} );   
        }
}