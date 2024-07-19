import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbAlertModule, NgbAlert  } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'delete-user',
    standalone: true,
    templateUrl: './delete-user.component.html',
    imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule, CommonModule]
})
export class DeleteUserComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  @Input() user!: User;
  deleteUserForm: FormGroup;
  private _successMessage$ = new BehaviorSubject<string>('');
  private _errorMessage$ = new BehaviorSubject<string>('');
  successMessage: string | null = null;
  errorMessage: string | null = null;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient, private userService: UserService,) {
    this.deleteUserForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: ['']
    });
    this._successMessage$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());

      this._errorMessage$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.errorMessage= message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('userDeleted') === 'true') {
        this._successMessage$.next(`User deleted successfully.`);
        localStorage.removeItem('userDeleted');
      }
    }
    if (this.user) {
      this.deleteUserForm.patchValue(this.user);
    }
  }

  open(user: User) {
    this.user = user;
    this.deleteUserForm.patchValue(user);
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
  }

  public onSubmit(modal: any) {
    this.userService.deleteUser(this.user.id)
    .subscribe(
      (response: any) => {
        console.log(response !== undefined); // Use !== for strict inequality comparison
        if (response !== undefined) {
          modal.close('Save click');
            localStorage.setItem('userDeleted', 'true');
            window.location.reload();
        }
      },
      (error: any) => {
        console.error(error);
        if (error.status === 400) {
          this._errorMessage$.next(`Bad request: ${error.error}`);
        } else if (error.status === 500) {
          this._errorMessage$.next(`Internal server error: ${error.error}`);
        } else {
          this._errorMessage$.next(`Error deleting user: ${error.message}`);
        }
        modal.close('Save click');
      }
    );
  }
}
