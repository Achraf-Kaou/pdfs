import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
export class NavBarComponent implements OnInit, OnChanges {
  @Input() pdfPageUrl!: boolean;
  @Input() searchQuery: string = '';
  @Output() searchValueChange = new EventEmitter<string>();
  searchControl = new FormControl('');
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;
  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  @Output() saveEvent = new EventEmitter<void>();
  user!: User;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user) {
        this.user = user;
      }
    }
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      this.searchControl.setValue(savedQuery, { emitEvent: false });
      this.onSearch();
      localStorage.removeItem('searchQuery');
    }else{

    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Adjust debounce time as needed
      distinctUntilChanged()
    ).subscribe((value: any) => {
      if (value) {
        // Save the search term to local storage
        localStorage.setItem('searchQuery', value);
      }
      this.searchValueChange.emit(value);

    });}
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery']) {
      this.searchControl.setValue(changes['searchQuery'].currentValue, { emitEvent: false });
    }
  }

  onSearch() {
    const value = this.searchControl.value || '';
    localStorage.setItem('searchQuery', value);
    this.searchValueChange.emit(value);
    if (this.router.url !== '/home') {
      // Navigate to home page with search query as a parameter
      this.router.navigate(['/home'], { queryParams: { search: value } });
    }
  }

  openModalAdd() {
    this.addUserComponent.open();
  }

  openUploadModel(){
    this.pdfUploadComponent.open();
  }

  onInputChange() {
    const value = this.searchControl.value || '';
    localStorage.setItem('searchQuery', value);
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