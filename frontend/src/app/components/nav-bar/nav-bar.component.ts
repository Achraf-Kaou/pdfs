import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../models/User';
import { AddUserComponent } from "../users/add-user/add-user.component";
import { PdfUploadComponent } from "../pdfs/pdf-upload/pdf-upload.component";


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddUserComponent, PdfUploadComponent,FontAwesomeModule,MatIcon,MatMenuModule,MatIconModule,MatDividerModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit, OnChanges {
  @Input() pdfPageUrl!: boolean; // insuring that this is the pdf content page 
  @Input() searchQuery: string = ''; // if there is a search query in the local storage 
  @Output() searchValueChange = new EventEmitter<string>(); // if the search query changes 
  @Output() saveEvent = new EventEmitter<void>(); // when clique on the save button ==> save the pdf content
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;
  @ViewChild(PdfUploadComponent) pdfUploadComponent!: PdfUploadComponent;
  user!: User;
  searchControl = new FormControl('');

  faUser = faUser;
  faRightFromBracket = faRightFromBracket;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // getting user from local storage
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      const user: User = JSON.parse(userData);
      if (user) {
        this.user = user;
      }
    }
    // getting search query from local storage and emit the event if exists
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) { // if exists search 
      this.searchControl.setValue(savedQuery, { emitEvent: false });
      this.onSearch();
      localStorage.removeItem('searchQuery');
    }else{ // else set up necessary event and form control for the search
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

  // for the changes in the search input
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery']) {
      this.searchControl.setValue(changes['searchQuery'].currentValue, { emitEvent: false });
    }
  }

  // for the search button click event
  onSearch() {
    const value = this.searchControl.value || '';
    localStorage.setItem('searchQuery', value);
    this.searchValueChange.emit(value);
    if (this.router.url !== '/pdfs') {
      this.router.navigate(['/pdfs'], { queryParams: { search: value } });
    }
  }

  //open the add user pop up modal
  openModalAdd() {
    this.addUserComponent.open();
  }

  // open the upload pop up modal
  openUploadModel(){
    this.pdfUploadComponent.open();
  }

  navigateToUsers() {
    this.router.navigate(['admin']);
  }

  // change the search query in local storage 
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