import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbAlert, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { Observable, Subject, debounceTime, tap } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../../models/User';


@Component({
  selector: 'edit-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlert, CommonModule, HttpClientJsonpModule],
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {
  @Input() user!: User;
  editUserForm!: FormGroup;
  @ViewChild('content') content!: TemplateRef<any>;
  private _message$ = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  showPassword!: boolean;


  constructor(private userService: UserService, private modalService: NgbModal, private http: HttpClient) {
    this._message$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.successMessage = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlert?.close());
      this.showPassword = false;
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('userEdited') === 'true') {
        this._message$.next(`User edited successfully.`);
        localStorage.removeItem('userEdited');
      }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      if (this.showPassword) {
        passwordInput.setAttribute('type', 'text');
      } else {
        passwordInput.setAttribute('type', 'password');
      }
  }
  }

  get firstName() {
    return this.editUserForm.get('firstName');
  }
  get lastName() {
    return this.editUserForm.get('lastName');
  }
  get email() {
    return this.editUserForm.get('email');
  }
  get password() {
    return this.editUserForm.get('password');
  }
  get role() {
    return this.editUserForm.get('role');
  }

  open(user: User) {
    this.user = user;
    if (this.user) {
      this.editUserForm = new FormGroup({
        firstName: new FormControl(this.user.firstName, [Validators.required]),
        lastName: new FormControl(this.user.lastName, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        password: new FormControl(this.user.password, [Validators.required, Validators.minLength(8)]),
        role: new FormControl(this.user.role, [Validators.required]),
        permission: new FormArray([
          new FormControl(this.user.permission[0]),
          new FormControl(this.user.permission[1]),
          new FormControl(this.user.permission[2])
        ])
      });
    }
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  hasPermission(permission: string): boolean {
    return this.user.permission.includes(permission);
  }

  public onSubmit(modal: any) {
    this.editUserForm.markAllAsTouched();
    if (this.editUserForm.invalid) {
      return;
    }
    const user: User = {
      firstName: this.editUserForm.get('firstName')?.value,
      lastName: this.editUserForm.get('lastName')?.value,
      email: this.editUserForm.get('email')?.value,
      password: this.editUserForm.get('password')?.value,
      role: this.editUserForm.get('role')?.value,
      permission: (this.editUserForm.get('permission') as FormArray).controls.map((control, index) => {
        if (control.value) {
          switch (index) {
            case 0:
              return 'Read';
            case 1:
              return 'Write';
            default:
              return '';
          }
        } else {
          return '';
        }
      }).filter(permission => permission !== ''),
    };
    this.userService.editUser(this.user.id, user)
      .subscribe(
        (response: any) => {
          console.log(response !== undefined)
          if (response !== undefined) {
            modal.close('Save click');
            localStorage.setItem('userEdited', 'true');
            window.location.reload();
          }
        },
        (error: any) => {
          console.error(error);
          if (error.status === 400) {
            this._message$.next(`Bad request: ${error.error}`);
            modal.close('Save click');
          } else if (error.status === 500) {
            this._message$.next(`Internal server error: ${error.error}`);
            modal.close('Save click');
          } else {
            this._message$.next(`Error editing user: ${error.message}`);
            modal.close('Save click');
          }
        }
      );
  }
}