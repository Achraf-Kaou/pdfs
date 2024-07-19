import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocument } from 'pdf-lib';
import { PdfService } from '../../../services/Pdf.service';
import { User } from '../../../models/User';
import { BehaviorSubject, debounceTime, Subject, tap } from 'rxjs';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, NgbAlertModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit, OnDestroy {
  @Input() pdfSrc!: Uint8Array;
  pdfDoc!: PDFDocument;
  idUser!: string;
  @Input() idPdf!: string | null;
  pdfSource!: any;

  private _successMessage$ = new BehaviorSubject<string>('');
  private _errorMessage$ = new BehaviorSubject<string>('');
  successMessage: string | null = null;
  errorMessage: string | null = null;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;

  constructor(private pdfService: PdfService, private ngxService: NgxExtendedPdfViewerService){
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

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user && user.id) {
        this.idUser= user.id as string;
      }
    }
  }

  ngOnDestroy() {
    this._successMessage$.unsubscribe();
    this._errorMessage$.unsubscribe();
  }

  savePdf() {
    this.ngxService.getCurrentDocumentAsBlob().then((blob: Blob | undefined) => {
      if (blob) {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('user', this.idUser);

        this.pdfService.updatePdf(formData, this.idPdf).subscribe(response => {
          this._successMessage$.next(`file saved successfully`);
        }),
        ((error: any) => {
          this._errorMessage$.next(`error saving file`);
          console.log(error);
        })
      }
    });   
  }
}