import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/User';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'my-app';
  user!: User;
  
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {}
}
