import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from '../../services/Pdf.service';
import { PdfDocument } from '../../models/Pdf';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { PdfViewerComponent } from "../../components/pdfs/pdf-viewer/pdf-viewer.component";

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NavBarComponent, PdfViewerComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
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
