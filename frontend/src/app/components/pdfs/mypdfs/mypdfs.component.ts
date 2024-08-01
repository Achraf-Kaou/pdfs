import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Pdf } from '../../../models/Pdf';
import { PdfService } from '../../../services/Pdf.service';
import { PdfDeleteComponent } from '../pdf-delete/pdf-delete.component';
import { PdfUploadComponent } from '../pdf-upload/pdf-upload.component';
import { User } from '../../../models/User';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faPlus } from '@fortawesome/free-solid-svg-icons';
import { PdfDocument } from '../../../models/PdfDocument';
import { MatButtonModule } from '@angular/material/button';
import { PdfEditComponent } from '../pdf-edit/pdf-edit.component';
@Component({
  selector: 'app-mypdfs1',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule, PdfUploadComponent, PdfDeleteComponent, MatPaginatorModule, MatTableModule, MatSortModule, FontAwesomeModule, MatMenuModule, MatIconModule, NgbTooltipModule, MatExpansionModule, MatButtonModule, PdfEditComponent],
  templateUrl: './mypdfs.component.html',
  styleUrl: './mypdfs.component.css'
})
export class MypdfsComponent implements OnInit {

  pdfs: Pdf[] = [];
  userId: any | null = null;

  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @ViewChild(PdfDeleteComponent) pdfDeleteComponent!: PdfDeleteComponent;
  @ViewChild(PdfEditComponent) pdfEditComponent!: PdfEditComponent;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  selectedPdf: Pdf | null = null;
  dataSource = new MatTableDataSource<Pdf>;
  displayedColumns: string[] = ['date', 'size', 'user', 'actions'];

  faFilePdf=faFilePdf;
  faPlus=faPlus;
  dataSourceVersion = new MatTableDataSource<Pdf>;

  
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
      this.pdfService.getPdfsByUserId(this.userId).subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;  
      });
    }
  }

  navigateTo(id: string | undefined, version: string|undefined, event?: MouseEvent): void {
    if(event){
      event.stopPropagation();
    }
    this.router.navigate(['/pdf', id, version]);
  }

  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    console.log(date);
    // Format the date as dd/mm/yyyy
    return date.toLocaleDateString('en-GB');
  }

  openUploadModel(){
    this.pdfUploadComponent.open();
  }

  openDeleteModel(pdf : Pdf, event?: MouseEvent){
    if(event){
      event.stopPropagation();
    }
    this.selectedPdf = pdf;
    this.pdfDeleteComponent.open(pdf);
  }

  openEditModel(pdf : Pdf, event?: MouseEvent){
    if(event){
      event.stopPropagation();
    }
    this.selectedPdf = pdf;
    this.pdfEditComponent.open(pdf);
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
  getLatestVersion(pdf: Pdf): PdfDocument{
    return pdf.versions.reduce((latest, current) => 
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
  }

  eventAnuul(event: MouseEvent) {
    if(event){
      event.stopPropagation();
    }
  }
}

