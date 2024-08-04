import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../models/User';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-user',
  standalone: true,
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
        NgbPaginationModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule, 
        MatIconModule,
        MatMenuModule, 
        MatDividerModule, 
        MatButtonModule
      ],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent implements OnInit, AfterViewInit {
  @Input() users: Observable<User[]> | null = null;
  selectedUser: User | null = null;

  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;
  @ViewChild(EditUserComponent) editUserComponent!: EditUserComponent;
  @ViewChild(DeleteUserComponent) deleteUserComponent!: DeleteUserComponent;

  dataSource!: MatTableDataSource<User>;
  displayedColumns: string[] = ['name', 'email', 'role', 'permissions', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    if (this.users) {
      this.users.subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.userService.getAllUsers().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModalAdd() {
    this.addUserComponent.open();
  }

  openModalEdit(user: User) {
    this.selectedUser = user;
    this.editUserComponent.open(user);
  }

  openModalDelete(user: User) {
    this.selectedUser = user;
    this.deleteUserComponent.open(user);
  }
}