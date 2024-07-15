import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../../services/Pdf.service';
import { Observable } from 'rxjs';
import { PdfDocument } from '../../../models/Pdf';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfUploadComponent } from "../pdf-upload/pdf-upload.component";
import { PdfDeleteComponent } from "../pdf-delete/pdf-delete.component";
import { User } from '../../../models/User';


@Component({
    selector: 'app-pdf-list',
    standalone: true,
    templateUrl: './pdf-list.component.html',
    styleUrl: './pdf-list.component.css',
    imports: [NgbDropdownModule, CommonModule, PdfUploadComponent, PdfDeleteComponent]
})
export class PdfListComponent implements OnInit{

  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @ViewChild(PdfDeleteComponent) pdfDeleteComponent!: PdfDeleteComponent;
  @Input() pdfs: Observable<PdfDocument[]> | null = null;
  selectedPdf: PdfDocument | null = null;
  role: String | null = null;
  userId: object | undefined;
  permissions : Array<string> | null = null;
  user : User | null = null;


  
  constructor(private pdfService: PdfService, private router: Router){}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
      if (userData !== null) {
        const user: User = JSON.parse(userData);
        if (user && user.role) {
          this.role = user.role;
          this.userId = user.id;
          this.permissions = user.permission;
          this.user = user;
        }
      }
  }
  canDelete(pdf: PdfDocument): boolean {
    return this.role === 'Admin' || (pdf.userHistory && pdf.userHistory.length > 0 && pdf.userHistory[0].id === this.userId);
  }
  
  canEdit(pdf: PdfDocument): boolean | null {
    return this.role === 'Admin' || (this.permissions && this.permissions.includes("Write"));
  }
  
  canEditOrDelete(pdf: PdfDocument): boolean {
    return this.canEdit(pdf) || this.canDelete(pdf);
  }

  canEditAndDelete(pdf: PdfDocument): boolean | null {
    return this.isOwner(pdf) || (this.canEdit(pdf) && this.canDelete(pdf)); 
  }

  isOwner(pdf: PdfDocument) : boolean | null {
    const user: User = pdf.userHistory[0];
    console.log(pdf.userHistory[0]===this.user)
    console.log(this.user, pdf.userHistory[0])
    return user.id===this.user?.id;
  }

  navigateTo(id: string | undefined): void {
    this.router.navigate(['/pdf', id]);
  }

  navigateToPdf(id: string | undefined) {
    this.router.navigate(['/view', id]);
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
