import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pdf } from '../../../models/Pdf';
import { PdfService } from '../../../services/Pdf.service';
import { BehaviorSubject, Subject, debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-pdf-delete',
  standalone: true,
  imports: [NgbAlert],
  templateUrl: './pdf-delete.component.html',
  styleUrl: './pdf-delete.component.css'
})
export class PdfDeleteComponent {

  @ViewChild('content') content!: TemplateRef<any>;
  pdf!: Pdf;
  private _successMessage$ = new BehaviorSubject<string>('');
  private _errorMessage$ = new BehaviorSubject<string>('');
  successMessage: string | null = null;
  errorMessage: string | null = null;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;

  constructor(private modalService: NgbModal, private pdfService: PdfService){
    this._successMessage$
      .pipe(
        tap((message) => (this.successMessage = message)),
        debounceTime(5000)
      )
      .subscribe(() => (this.successMessage = null));

    this._errorMessage$
      .pipe(
        tap((message) => (this.errorMessage = message)),
        debounceTime(5000)
      )
      .subscribe(() => (this.errorMessage = null));
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('PDFDeleted') === 'true') {
        this._successMessage$.next(`PDF deleted successfully.`);
        localStorage.removeItem('PDFDeleted');
      }
    }
  }

  open(pdf : Pdf){
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
    console.log(pdf);
    this.pdf = pdf;
  }

  deleleFile(modal: any) {
    this.pdfService.deletePdf(this.pdf.id)
    .subscribe(
      (response: any) => {
        console.log(response !== undefined);
        if (response !== undefined) {
          modal.close('Save click');
            localStorage.setItem('PDFDeleted', 'true');
            window.location.reload();
        }
      },
      (error: any) => {
        console.error(error);
        if (error.status === 400) {
          this._errorMessage$.next(`Bad request: ${error.error}`);
        } else if (error.status === 500) {
          this._errorMessage$.next(`Internal server error: ${error.error}`);
        } else {
          this._errorMessage$.next(`Error deleting PDF: ${error.message}`);
        }
        modal.close('Save click');
      }
    );
  }

}
