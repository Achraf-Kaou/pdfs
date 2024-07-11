import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbAlertModule, NgbAlert  } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
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
    imports: [FormsModule, ReactiveFormsModule, NgbModalModule, NgbAlertModule]
})
export class DeleteUserComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  @Input() user!: User;
  deleteUserForm: FormGroup;
  private _message$ = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient, private userService: UserService,) {
    this.deleteUserForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: ['']
    });
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('userDeleted') === 'true') {
        this._message$.next(`User deleted successfully.`);
        localStorage.removeItem('userDeleted');
      }
    } else {
      console.warn('localStorage is not available. This might occur in SSR or testing.');
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
          this._message$.next(`Bad request: ${error.error}`);
        } else if (error.status === 500) {
          this._message$.next(`Internal server error: ${error.error}`);
        } else {
          this._message$.next(`Error deleting user: ${error.message}`);
        }
        modal.close('Save click');
      }
    );
  }
}
