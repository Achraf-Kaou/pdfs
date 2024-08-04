import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from '../../services/Pdf.service';
import { Pdf } from '../../models/Pdf';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfViewerComponent } from "../../components/pdfs/pdf-viewer/pdf-viewer.component";
import { PdfDocument } from '../../models/PdfDocument';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [NavBarComponent, PdfViewerComponent],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit {
  pdf!: PdfDocument;
  pdfSrc!: Uint8Array;
  pdfViewer: any;

  constructor(private pdfService: PdfService, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getPdfById(id);
  }

  getPdfById(id: string | null): void {
    this.pdfService.getPdfById(id).subscribe(
      (pdf: any) => {
          this.pdf = this.getLatestVersion(pdf);
          const pdfDoc =  this.getLatestVersion(pdf);
          const base64PDF = pdfDoc.data;
          const base64String = Array.prototype.join.call(base64PDF, '');
          const byteNumbers = Array.from(atob(base64String));
          this.pdfSrc = new Uint8Array(byteNumbers.map((byte) => byte.charCodeAt(0)));
      },
      (error: any) => {
        console.error('Error fetching PDF:', error);
      }
    );
  }

  getLatestVersion(pdf: Pdf): PdfDocument{
    return pdf.versions.reduce((latest, current) => 
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
  }
}

