import { Component, ViewChild, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@Component({
  standalone: true,
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
  imports :[ ReactiveFormsModule, CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NgbAlertModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatCardModule,
  ], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword!: boolean;
  user!: User;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert | undefined;
  private _message$ = new Subject<string>();
  error = '';
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private http: HttpClient, private userService: UserService, private router: Router) { 
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.error = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required ,Validators.minLength(8)]),
    });
    this.showPassword = false;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    const email= this.loginForm.get('email')?.value;
    const password= this.loginForm.get('password')?.value;
    this.userService.login(email,password)
    .subscribe(
      (response: any) => {
        if(response.role==="Admin"){
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigateByUrl('/admin');  
        }else {
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigateByUrl('/pdfs');  
        }
      },
      (error: any) => {
        this._message$.next(`error user not found`);
      }
    );
  }
}