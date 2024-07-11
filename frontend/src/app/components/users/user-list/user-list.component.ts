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
export class UserListComponent {
  
  refreshUsers() {
  throw new Error('Method not implemented.');
  }
  @Input() users: Observable<User[]> | null = null;
  selectedUser: User | null = null;
  
  @ViewChild(EditUserComponent) editUserComponent!: EditUserComponent;
  @ViewChild(DeleteUserComponent) deleteUserComponent!: DeleteUserComponent;

  
  constructor() { }

  
  openModalEdit(user:  User){
    this.selectedUser = user;
    this.editUserComponent.open(user);
  }
  openModalDelete(user: User){
    this.selectedUser = user;
    this.deleteUserComponent.open(user);
  }
}
