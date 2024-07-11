import { Component, OnInit, ViewChild, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../../services/Pdf.service';
import { PdfDocument } from '../../../models/Pdf';
import { Subject, debounceTime, tap } from 'rxjs';
import { NgbAlert, ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../models/User';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbAlert],
  templateUrl: './pdf-upload.component.html',
})
export class PdfUploadComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  pdfSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  private _message$ = new Subject<string>();
  Message = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  uploadForm!: FormGroup;
  progress = 0;
  message = '';

  constructor(private pdfService: PdfService, private modalService: NgbModal) {
    this._message$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.Message = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('pdfAdded') === 'true') {
        this._message$.next(`PDF added successfully.`);
        localStorage.removeItem('pdfAdded');
      }
    }

    this.uploadForm = new FormGroup({
      titre: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      pdf: new FormControl('', [Validators.required]),
    });
  }

  open(){
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfSrc = reader.result;
        this.uploadForm.patchValue({
          pdf: this.selectedFile
        });
      };
      reader.readAsArrayBuffer(this.selectedFile);
    }
  }

  onFormSubmit() {
    this.uploadForm.markAllAsTouched();
    if (this.uploadForm.invalid) {
      return;
    }
    this.progress = 0;

    const formData: FormData = new FormData();
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
        if (error && error.message) {
          this.message = error.message;
        } else {
          this.message = 'Could not upload the file!';
        }
        // Do not reload the page on error
      }
    );
  }
}