import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PdfViewComponent } from "../../components/pdfs/pdf-view/pdf-view.component";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfService } from '../../services/Pdf.service';
import { ActivatedRoute } from '@angular/router';
import { Pdf } from '../../models/Pdf';


@Component({
    selector: 'app-pdf',
    standalone: true,
    templateUrl: './pdf.component.html',
    styleUrl: './pdf.component.css',
    imports: [NavBarComponent, PdfViewComponent]
})
export class PdfComponent implements OnInit {
  pdf!: Pdf;
  pdfSrc!: Uint8Array;
  pdfViewer: any;
  id!: string | null;
  @ViewChild(PdfViewComponent) pdfView!: PdfViewComponent;

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