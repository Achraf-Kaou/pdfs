import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../models/User';


@Component({
    selector: 'user-list',
    standalone: true,
    templateUrl: './user-list.component.html',
    providers: [UserService, DecimalPipe],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModalModule,
        DecimalPipe,
        NgbAlertModule,
        AddUserComponent,
        EditUserComponent,
        DeleteUserComponent,
        HttpClientModule,
        NgbPaginationModule
    ]
})
export class UserListComponent implements OnInit {
  @Input() users: Observable<User[]> | null = null;
  selectedUser: User | null = null;
  
  @ViewChild(EditUserComponent) editUserComponent!: EditUserComponent;
  @ViewChild(DeleteUserComponent) deleteUserComponent!: DeleteUserComponent;

  paginatedUsers: User[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;

  
  constructor() { }

  ngOnInit() {
    if (this.users) {
      this.users.subscribe(data => {
        this.collectionSize = data.length;
        this.refreshUsers();
      });
    }
  }

  refreshUsers() {
    if (this.users) {
      this.users.subscribe(data => {
        this.paginatedUsers = data
          .map((user, i) => ({ id: i + 1, ...user }))
          .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      });
    }
  }

  
  openModalEdit(user:  User){
    this.selectedUser = user;
    this.editUserComponent.open(user);
  }
  openModalDelete(user: User){
    this.selectedUser = user;
    this.deleteUserComponent.open(user);
  }
}
