import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../services/Pdf.service';
import { Observable } from 'rxjs';
import { PdfDocument } from '../../../models/Pdf';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfUploadComponent } from "../pdf-upload/pdf-upload.component";
import { PdfDeleteComponent } from "../pdf-delete/pdf-delete.component";


@Component({
    selector: 'app-pdf-list',
    standalone: true,
    templateUrl: './pdf-list.component.html',
    styleUrl: './pdf-list.component.css',
    imports: [NgbDropdownModule, CommonModule, PdfUploadComponent, PdfDeleteComponent]
})
export class PdfListComponent implements OnInit{
  pdfs$!: Observable<PdfDocument[]>;
  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @ViewChild(PdfDeleteComponent) pdfDeleteComponent!: PdfDeleteComponent;

  selectedPdf: PdfDocument | null = null;

  
  constructor(private pdfService: PdfService, private router: Router){}

  ngOnInit(): void {
    this.pdfs$ = this.pdfService.getPdfs();
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
