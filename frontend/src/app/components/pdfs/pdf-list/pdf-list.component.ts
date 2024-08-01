import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Pdf } from '../../../models/Pdf';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfUploadComponent } from "../pdf-upload/pdf-upload.component";
import { PdfDeleteComponent } from "../pdf-delete/pdf-delete.component";
import { User } from '../../../models/User';
import { MatPaginator, MatPaginatorModule  } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule  } from '@angular/material/table';
import { MatSort, MatSortModule  } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilePdf,faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfDocument } from '../../../models/PdfDocument';




@Component({
    selector: 'app-pdf-list',
    standalone: true,
    templateUrl: './pdf-list.component.html',
    styleUrl: './pdf-list.component.css',
    imports: [NgbDropdownModule, CommonModule, PdfUploadComponent, PdfDeleteComponent, MatPaginatorModule, MatTableModule, MatSortModule, FontAwesomeModule, MatMenuModule, MatIconModule, NgbTooltipModule]
})
export class PdfListComponent implements OnInit, AfterViewInit, OnChanges{

  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @ViewChild(PdfDeleteComponent) pdfDeleteComponent!: PdfDeleteComponent;
  @Input() pdfDocuments$!: Observable<Pdf[]>;
  @Input() searchQuery: string = '';
  selectedPdf: Pdf | null = null;
  role: String | null = null;
  userId: object | undefined;
  permissions : Array<string> | null = null;
  user : User | null = null;
  dataSource = new MatTableDataSource<Pdf>;
  displayedColumns: string[] = ['name', 'date', 'size', 'user', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  faFilePdf = faFilePdf;
  faEye = faEye;
  faPlus=faPlus
  constructor(private router: Router){}

  ngOnInit(): void {
    this.pdfDocuments$.subscribe(data => {
      console.log(data)
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    });
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfDocuments$']) {
      this.pdfDocuments$.subscribe(data => {
        this.dataSource.data = data;
        this.applyFilter(this.searchQuery);
      });
    }
    if (changes['searchQuery']) {
      this.applyFilter(this.searchQuery);
    }
  }

  applyFilter(query: string): void {
    this.dataSource.filter = query.trim().toLowerCase();
  }

  ngAfterViewInit() {
    // Initialize paginator and sort only after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  canReadOnly(): any{
    return this.user?.role === 'Admin' || this.user?.role === 'Guest' || (this.user?.role === 'User' && this.user.permission.length === 1 && this.user.permission[0] === 'Read')
  }

  canEdit(){
    return this.user?.role === 'User' && this.user?.permission.includes('Write');
  }

  canDelete() {
    return this.user?.role === 'User' && this.user?.permission.includes('Delete');
  }
  
  isOwner(pdf: Pdf) : boolean | null {
    const user: User = pdf.versions[0].user;
    return user.id===this.user?.id;
  }

  navigateTo(id: string | undefined, version: string|undefined): void {
    console.log(id)
    this.router.navigate(['/pdf', id, version]);
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

  openDeleteModel(pdf : Pdf){
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

  getLastDateHistory(dateHistory: Date[]) {
    return dateHistory[dateHistory.length - 1];
  }

  getLatestVersion(pdf: Pdf): PdfDocument{
    return pdf.versions.reduce((latest, current) => 
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
  }
  
  
}
