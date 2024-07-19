import { Component, OnInit, ViewChild, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../../services/Pdf.service';
import { PdfDocument } from '../../../models/Pdf';
import { BehaviorSubject, Subject, debounceTime, tap } from 'rxjs';
import { NgbAlert, ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../models/User';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { fileTypeValidator } from '../../../services/fileTypeValidator';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbAlert],
  templateUrl: './pdf-upload.component.html',
})
export class PdfUploadComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  pdfSrc: string | ArrayBuffer | null = null;
  selectedFile!: File;

  private _successMessage$ = new BehaviorSubject<string>('');
  private _errorMessage$ = new BehaviorSubject<string>('');
  successMessage: string | null = null;
  errorMessage: string | null = null;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;

  uploadForm!: FormGroup;
  progress = 0;

  constructor(private pdfService: PdfService, private modalService: NgbModal, private fb: FormBuilder,) {
    this.uploadForm = this.fb.group({
      pdf: [null, [Validators.required, fileTypeValidator(['pdf'])]]
    });
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
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('pdfAdded') === 'true') {
        this._successMessage$.next(`PDF added successfully.`);
        localStorage.removeItem('pdfAdded');
      }
    }

    this.uploadForm = new FormGroup({
      titre: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      pdf: new FormControl('', [Validators.required]),
    });
  }
  ngOnDestroy() {
    this._successMessage$.unsubscribe();
    this._errorMessage$.unsubscribe();
  }

  open(){
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }
  isValidPdf(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (file.type !== 'application/pdf') {
        resolve(false);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = String.fromCharCode(...uint8Array.slice(0, 5));
        resolve(header === '%PDF-');
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.isValidPdf(this.selectedFile).then((isValid) => {
        if (isValid) {
          const reader = new FileReader();
          reader.onload = () => {
            this.pdfSrc = reader.result;
            this.uploadForm.patchValue({
              pdf: this.selectedFile
            });
          };
          reader.readAsArrayBuffer(this.selectedFile);
        } else {
          console.error('The selected file is not a valid PDF.');
        }
      }).catch((error) => {
        console.error('Error validating PDF file:', error);
      });
    }
  }

  onFormSubmit() {
    this.uploadForm.markAllAsTouched();
    if (this.uploadForm.invalid) {
      return;
    }
    this.progress = 0;

    const formData: FormData = new FormData();
    formData.append('titre', this.uploadForm.get('titre')?.value);
    formData.append('file', this.selectedFile as Blob, this.selectedFile?.name || '');
    formData.append('description', this.uploadForm.get('description')?.value);
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user && user.id) {
        formData.append('user', user.id.toString());
      }
    }

    this.pdfService.upload(formData).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log('Uploaded file:', event);
          localStorage.setItem('pdfAdded', 'true');
          window.location.reload(); // Reload only when the upload is successful
        }
      },
      (error: any) => {
        console.error('Upload error:', error);
        this.progress = 0;
        this.errorMessage = 'Could not upload the file!';
      }
    );
  }
}

