import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Pdf } from '../../../models/Pdf';
import { PdfService } from '../../../services/Pdf.service';
import { BehaviorSubject, debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-pdf-delete',
  standalone: true,
  imports: [NgbAlert],
  templateUrl: './pdf-delete.component.html',
  styleUrl: './pdf-delete.component.css'
})
export class PdfDeleteComponent {

  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  private _successMessage$ = new BehaviorSubject<string>('');
  private _errorMessage$ = new BehaviorSubject<string>('');
  successMessage: string | null = null;
  errorMessage: string | null = null;
  pdf!: Pdf;

  constructor(private modalService: NgbModal, private pdfService: PdfService){
    // init for the alerts
    this._successMessage$
      .pipe(
        tap((message) => (this.successMessage = message)),
        debounceTime(3000)
      )
      .subscribe(() => (this.successMessage = null));

    this._errorMessage$
      .pipe(
        tap((message) => (this.errorMessage = message)),
        debounceTime(3000)
      )
      .subscribe(() => (this.errorMessage = null));
  }

  ngOnInit() {
    // Check if a PDF was deleted from the local storage and display a success message if so.
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('PDFDeleted') === 'true') {
        this._successMessage$.next(`PDF deleted successfully.`);
        localStorage.removeItem('PDFDeleted');
      }
    }
  }

  //open the delete pdf modal
  open(pdf : Pdf){
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
    this.pdf = pdf;
  }

  deleleFile(modal: any) {
    this.pdfService.deletePdf(this.pdf.id)
    .subscribe(
      (response: any) => {
        console.log(response !== undefined);
        if (response !== undefined) { // passing the success to the local storage
            modal.close('Save click');
            localStorage.setItem('PDFDeleted', 'true');
            window.location.reload();
        }
      },
      (error: any) => {
        //displaying the error alert
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
