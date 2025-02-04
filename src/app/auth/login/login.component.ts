import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  message: string;

  constructor(public authService: AuthService, public router: Router) {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.login, form.value.password);
  }
}
