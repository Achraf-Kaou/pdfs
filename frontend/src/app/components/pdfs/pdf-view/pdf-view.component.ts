import { Component, Input, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfService } from '../../../services/Pdf.service';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit {
  @Input() pdfSrc!: Uint8Array;
  pdfDoc!: PDFDocument;

  constructor(private sanitizer: DomSanitizer, private pdfService: PdfService){}

  ngOnInit(): void {}
}