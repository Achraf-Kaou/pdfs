import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PdfDocument } from '../../../models/Pdf';
import { PdfService } from '../../../services/Pdf.service';
import { PdfDeleteComponent } from '../pdf-delete/pdf-delete.component';
import { PdfUploadComponent } from '../pdf-upload/pdf-upload.component';
import { User } from '../../../models/User';

@Component({
  selector: 'app-mypdfs1',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule, PdfUploadComponent, PdfDeleteComponent],
  templateUrl: './mypdfs.component.html',
  styleUrl: './mypdfs.component.css'
})
export class MypdfsComponent implements OnInit {

  pdfs: PdfDocument[] = [];
  userId: any | null = null;

  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @ViewChild(PdfDeleteComponent) pdfDeleteComponent!: PdfDeleteComponent;
  selectedPdf: PdfDocument | null = null;

  
  constructor(private pdfService: PdfService, private router: Router){}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user && user.id) {
        this.userId = user.id;
      }
    }
    if (this.userId) {
      this.pdfService.getPdfsByUserId(this.userId).subscribe(
        (data) => {
          this.pdfs = data;
        },
        (error) => {
          console.error('Error fetching PDFs:', error);
        }
      );
    }
  }

  NavigateTo(id: string | undefined): void {
    this.router.navigate(['/pdf', id]);
  }

  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    // Format the date as dd/mm/yyyy
    return date.toLocaleDateString('en-GB');
  }

  openUploadModel(){
    this.pdfUploadComponent.open();
  }

  openDeleteModel(pdf : PdfDocument){
    this.selectedPdf = pdf;
    this.pdfDeleteComponent.open(pdf);
  }

  transform(size: number): string {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

