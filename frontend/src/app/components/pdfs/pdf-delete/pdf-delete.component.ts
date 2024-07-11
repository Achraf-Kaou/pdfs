import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfDocument } from '../../../models/Pdf';
import { PdfService } from '../../../services/Pdf.service';
import { Subject, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pdf-delete',
  standalone: true,
  imports: [NgbAlert],
  templateUrl: './pdf-delete.component.html',
  styleUrl: './pdf-delete.component.css'
})
export class PdfDeleteComponent {

  @ViewChild('content') content!: TemplateRef<any>;
  pdf!: PdfDocument;
  private _message$ = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;

  constructor(private modalService: NgbModal, private pdfService: PdfService){
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('PDFDeleted') === 'true') {
        this._message$.next(`PDF deleted successfully.`);
        localStorage.removeItem('PDFDeleted');
      }
    }
  }

  open(pdf : PdfDocument){
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
    console.log(pdf);
    this.pdf = pdf;
  }

  deleleFile(modal: any) {
    this.pdfService.deletePdf(this.pdf.id)
    .subscribe(
      (response: any) => {
        console.log(response !== undefined); // Use !== for strict inequality comparison
        if (response !== undefined) {
          modal.close('Save click');
            localStorage.setItem('PDFDeleted', 'true');
            window.location.reload();
        }
      },
      (error: any) => {
        console.error(error);
        if (error.status === 400) {
          this._message$.next(`Bad request: ${error.error}`);
        } else if (error.status === 500) {
          this._message$.next(`Internal server error: ${error.error}`);
        } else {
          this._message$.next(`Error deleting PDF: ${error.message}`);
        }
        modal.close('Save click');
      }
    );
  }

}
