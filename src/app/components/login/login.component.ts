import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from 'src/app/requests/login.request.model';
import { LoggedInResponse } from 'src/app/responses/logged-in.response.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  loginForm: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    let req : LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.authService.login(req);
  }

  private initForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

}
