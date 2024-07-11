import { Component, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from "../../components/users/user-list/user-list.component";
import { AddUserComponent } from "../../components/users/add-user/add-user.component";
import { EditUserComponent } from "../../components/users/edit-user/edit-user.component";
import { DeleteUserComponent } from "../../components/users/delete-user/delete-user.component";
import { UserService } from '../../services/user.service';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    imports: [UserListComponent, AddUserComponent, EditUserComponent, DeleteUserComponent, FormsModule, ReactiveFormsModule, NavBarComponent]
})
export class AdminComponent implements OnInit {
  users$: Observable<User[]> | null = null;
  filter = new FormControl('');

  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.filter.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      if (filterValue!== null) {
        this.users$ = this.userService.getUsersFiltered(filterValue);
      }
    });
  }

  loadUsers(): void {
    this.users$ = this.userService.getAllUsers();
  }

  openModalAdd() {
    this.addUserComponent.open();
  }
}
