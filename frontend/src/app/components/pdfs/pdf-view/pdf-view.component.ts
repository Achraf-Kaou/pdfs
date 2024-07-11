import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfDocument } from '../../../models/Pdf';
import { PdfService } from '../../../services/Pdf.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit {
  @Input() pdfSrc!: Uint8Array;

  constructor(private sanitizer: DomSanitizer){}

  ngOnInit(): void {}
  
}