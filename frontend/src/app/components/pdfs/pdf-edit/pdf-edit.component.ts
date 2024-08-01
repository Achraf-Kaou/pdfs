import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { PdfService } from '../../../services/Pdf.service';
import { HttpEventType } from '@angular/common/http';
import { Pdf } from '../../../models/Pdf';

@Component({
  selector: 'app-pdf-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbAlert],
  templateUrl: './pdf-edit.component.html',
  styleUrl: './pdf-edit.component.css'
})
export class PdfEditComponent {
  @ViewChild('content') content!: TemplateRef<any>;
  pdf!: Pdf;

  private _successMessage$ = new BehaviorSubject<string>('');
  private _errorMessage$ = new BehaviorSubject<string>('');
  successMessage: string | null = null;
  errorMessage: string | null = null;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;

  editForm!: FormGroup;

  constructor(private pdfService: PdfService, private modalService: NgbModal, private fb: FormBuilder) {
    this._successMessage$
    .pipe(debounceTime(5000))
    .subscribe(() => (this.successMessage = null));

    this._errorMessage$
      .pipe(debounceTime(5000))
      .subscribe(() => (this.errorMessage = null));
  }

  ngOnInit(): void {
    const pdfAdded = localStorage.getItem('pdfEdited');
    if (pdfAdded === 'true') {
      this._successMessage$.next('PDF edited successfully.');
      localStorage.removeItem('pdfEdited');
    }
  }

  open(pdf: Pdf) {
    console.log(pdf);
    this.pdf = pdf;
    this.editForm = this.fb.group({
      titre: [this.pdf.titre, [Validators.required]],
      description: [this.pdf.description],
    })

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });

  }

  onFormSubmit(modal: any) {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      return;
    }

    const formData: FormData = new FormData();
    formData.append('titre', this.editForm.get('titre')?.value);
    formData.append('description', this.editForm.get('description')?.value);

    this.pdfService.editPdf(formData, this.pdf.id).subscribe(
      (event: any) => {
        modal.close('Save click');
        localStorage.setItem('pdfEdited', 'true');
        window.location.reload();
      },
      (error: any) => {
        console.error('Edit error:', error);
        this.errorMessage = 'Could not Edit the file!';
      }
    );
  }

}
