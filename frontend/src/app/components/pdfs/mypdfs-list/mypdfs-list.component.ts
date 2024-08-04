import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilePdf, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Pdf } from '../../../models/Pdf';
import { User } from '../../../models/User';
import { PdfDocument } from '../../../models/PdfDocument';
import { PdfService } from '../../../services/Pdf.service';
import { PdfDeleteComponent } from '../pdf-delete/pdf-delete.component';
import { PdfUploadComponent } from '../pdf-upload/pdf-upload.component';
import { PdfEditComponent } from '../pdf-edit/pdf-edit.component';

@Component({
  selector: 'app-mypdfs-list',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule, PdfUploadComponent, PdfDeleteComponent, MatPaginatorModule, MatTableModule, MatSortModule, FontAwesomeModule, MatMenuModule, MatIconModule, NgbTooltipModule, MatExpansionModule, MatButtonModule, PdfEditComponent],
  templateUrl: './mypdfs-list.component.html',
  styleUrl: './mypdfs-list.component.css'
})
export class MypdfsListComponent implements OnInit {
  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @ViewChild(PdfDeleteComponent) pdfDeleteComponent!: PdfDeleteComponent;
  @ViewChild(PdfEditComponent) pdfEditComponent!: PdfEditComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  // mat table init
  selectedPdf: Pdf | null = null;
  dataSource = new MatTableDataSource<Pdf>;
  displayedColumns: string[] = ['date', 'size', 'user', 'actions'];
  dataSourceVersion = new MatTableDataSource<Pdf>;


  pdfs: Pdf[] = [];
  userId: any | null = null;

  faFilePdf=faFilePdf;
  faPlus=faPlus;

  
  constructor(private pdfService: PdfService, private router: Router){}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user && user.id) {
        this.userId = user.id;
      }
    }
    // init the table with data by userId
    if (this.userId) {
      this.pdfService.getPdfsByUserId(this.userId).subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;  
      });
    }
  }

  // navigation to the pdf content by version
  navigateTo(id: string | undefined, version: string|undefined, event?: MouseEvent): void {
    // stopping the accordination from openning when clicking on a button
    if(event){
      event.stopPropagation();
    }
    this.router.navigate(['/pdf', id, version]);
  }

  // changing the date fromat 
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
  // changing the size format
  transform(size: number): string {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // getting the last version of the pdf
  getLatestVersion(pdf: Pdf): PdfDocument{
    return pdf.versions.reduce((latest, current) => 
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
  }

  // stopping the accordination from openning 
  eventAnuul(event: MouseEvent) {
    if(event){
      event.stopPropagation();
    }
  }
}


