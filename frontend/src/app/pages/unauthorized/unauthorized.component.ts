import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  constructor(private router: Router){}
  navigateToLogin() {
    this.router.navigateByUrl('');
  }

}
