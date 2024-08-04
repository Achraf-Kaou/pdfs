import { Component, OnInit, ViewChild } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfEditContentComponent } from "../../components/pdfs/pdf-edit-content/pdf-edit-content.component";
import { PdfService } from '../../services/Pdf.service';
import { ActivatedRoute } from '@angular/router';
import { Pdf } from '../../models/Pdf';

@Component({
  selector: 'app-pdf-content',
  standalone: true,
  imports: [PdfEditContentComponent, NavBarComponent],
  templateUrl: './pdf-content.component.html',
  styleUrl: './pdf-content.component.css'
})
export class PdfContentComponent implements OnInit {
  pdf!: Pdf;
  pdfSrc!: Uint8Array;
  pdfViewer: any;
  id!: string | null;
  @ViewChild(PdfEditContentComponent) pdfView!: PdfEditContentComponent;

  constructor(private pdfService: PdfService, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const version = this.route.snapshot.paramMap.get('version');
    this.id = id;
    this.getPdfById(id, version);
  }

  getPdfById(id: string | null, version: string|null): void {
    this.pdfService.getPdfDocByPdfId(id, version).subscribe(
      (pdf: any) => {
        console.log(pdf)
          this.pdf = pdf;
          const base64PDF = pdf.data;
          const byteNumbers = Array.from(atob(base64PDF));
          this.pdfSrc = new Uint8Array(byteNumbers.map((byte) => byte.charCodeAt(0)));
          console.log(this.pdfSrc)
      },
      (error: any) => {
        console.error('Error fetching PDF:', error);
      }
    );
  }

  onSave() {
    this.pdfView.savePdf();
  }
}