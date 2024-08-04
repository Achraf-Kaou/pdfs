import { Component } from '@angular/core';
import { AddUserComponent } from "../../components/users/add-user/add-user.component";
import { EditUserComponent } from "../../components/users/edit-user/edit-user.component";
import { DeleteUserComponent } from "../../components/users/delete-user/delete-user.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { ListUserComponent } from "../../components/users/list-user/list-user.component";

@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    imports: [AddUserComponent, EditUserComponent, DeleteUserComponent, FormsModule, ReactiveFormsModule, NavBarComponent, ListUserComponent]
})
export class AdminComponent {

}
