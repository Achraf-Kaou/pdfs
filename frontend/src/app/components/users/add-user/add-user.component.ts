import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbAlertModule, NgbAlert  } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user.service';



@Component({
  selector: 'add-user',
  standalone: true,
  imports: [ NgbModalModule, NgbAlertModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  @ViewChild('content') content!: TemplateRef<any>;
  private _message$ = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  addUserForm!: FormGroup;
  checkboxFormArray!: FormArray<FormControl<boolean | null>>;
  checkboxOptions: any;
  user!: User;
  showPassword!: boolean;

  constructor(private modalService: NgbModal, private http: HttpClient, private userService: UserService) {
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('userAdded') === 'true') {
        this._message$.next(`User added successfully.`);
        localStorage.removeItem('userAdded');
      }
    } else {
      console.warn('localStorage is not available. This might occur in SSR or testing.');
      // Handle accordingly, e.g., provide a fallback or mock
    }
    
    this.addUserForm = new FormGroup({
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required ,Validators.minLength(8)]),
      role: new FormControl('',[Validators.required]),
      permission: new FormArray([
        new FormControl(false),
        new FormControl(false),
        new FormControl(false)
      ])
    });
    this.showPassword = false;
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
    return this.addUserForm.get('firstName');
  }
  get lastName() {
    return this.addUserForm.get('lastName');
  }
  get email() {
    return this.addUserForm.get('email');
  }
  get password() {
    return this.addUserForm.get('password');
  }
  get role() {
    return this.addUserForm.get('role');
  }
  open() {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  public onSubmit(modal: any) {
    this.addUserForm.markAllAsTouched();
    if (this.addUserForm.invalid) {
      return;
    }
    
    const user: User = {
      firstName: this.addUserForm.get('firstName')?.value,
      lastName: this.addUserForm.get('lastName')?.value,
      email: this.addUserForm.get('email')?.value,
      password: this.addUserForm.get('password')?.value,
      role: this.addUserForm.get('role')?.value,
      permission: this.addUserForm.get('role')?.value === 'Admin' ? 
        ["Read", "Write", "Assign Permissions"] : 
        (this.addUserForm.get('permission') as FormArray).controls.map((control, index) => {
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
        }).filter(permission => permission !== '')
    };    
    
    this.userService.addUser(user)
    .subscribe(
      (response: any) => {
        console.log(response =! undefined)
        if (response ==! undefined) {
          modal.close('Save click');
          localStorage.setItem('userAdded', 'true');
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
          this._message$.next(`Error adding user: ${error.message}`);
          modal.close('Save click');
        }
      }
    );
  }
}
