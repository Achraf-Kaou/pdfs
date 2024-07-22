import { Component, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from "../../components/users/user-list/user-list.component";
import { AddUserComponent } from "../../components/users/add-user/add-user.component";
import { EditUserComponent } from "../../components/users/edit-user/edit-user.component";
import { DeleteUserComponent } from "../../components/users/delete-user/delete-user.component";
import { UserService } from '../../services/user.service';
import { Observable, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    imports: [UserListComponent, AddUserComponent, EditUserComponent, DeleteUserComponent, FormsModule, ReactiveFormsModule, NavBarComponent]
})
export class AdminComponent {



  constructor() { }

  
}
