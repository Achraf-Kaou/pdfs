import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PdfDocument } from '../../models/Pdf';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from "../users/add-user/add-user.component";
import { PdfUploadComponent } from "../pdfs/pdf-upload/pdf-upload.component";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddUserComponent, PdfUploadComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  @Input() pdfPageUrl!: boolean;
  @Input() pdf!: PdfDocument | null;
  @Output() searchValueChange = new EventEmitter<string>();
  searchControl = new FormControl('');
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;
  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @Output() saveEvent = new EventEmitter<void>();
  user!: User;

  constructor(private router: Router) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      this.searchValueChange.emit(value);
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
      if (userData !== null) {
        const user: User = JSON.parse(userData);
        if (user) {
          this.user = user;
        }
      }
  }

  openModalAdd() {
    this.addUserComponent.open();
  }

  openUploadModel(){
    this.pdfUploadComponent.open();
  }

  onSearch(): void {
    const searchValue = this.searchControl.value;
    // Navigate to the PDF list component with the search query
    this.router.navigate(['/home'], { queryParams: { search: searchValue } });
  }

  

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/');
  }

  onSave() {
    this.saveEvent.emit();
  }

}
