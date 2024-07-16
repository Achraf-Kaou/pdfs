import { Component, Input, OnInit } from '@angular/core';
import { PdfViewComponent } from "../../components/pdfs/pdf-view/pdf-view.component";
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfService } from '../../services/Pdf.service';
import { ActivatedRoute } from '@angular/router';
import { PdfDocument } from '../../models/Pdf';

@Component({
    selector: 'app-pdf',
    standalone: true,
    templateUrl: './pdf.component.html',
    styleUrl: './pdf.component.css',
    imports: [NavBarComponent, PdfViewComponent]
})
export class PdfComponent implements OnInit {
  pdf!: PdfDocument;
  pdfSrc!: Uint8Array;
  pdfViewer: any;
  id!: string |null;
  constructor(private pdfService: PdfService, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getPdfById(id);
    this.id=id;
  }

  getPdfById(id: string | null): void {
    this.pdfService.getPdfById(id).subscribe(
      (pdf: any) => {
        if (pdf.data && pdf.data.length > 0) {
          this.pdf = pdf;
          const base64PDF = pdf.data;
          const byteNumbers = Array.from(atob(base64PDF));
          this.pdfSrc = new Uint8Array(byteNumbers.map((byte) => byte.charCodeAt(0)));
        } else {
          console.error('Invalid or empty PDF data');
        }
      },
      (error: any) => {
        console.error('Error fetching PDF:', error);
      }
    );
  }
}
