import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from 'src/app/requests/resgister.request.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private http: HttpService) { }

  registerForm: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    let req: RegisterRequest = {
      first_name: this.registerForm.value.firstName,
      last_name: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      password_confirmation: this.registerForm.value.passwordConfirmation,
      organization_name: this.registerForm.value.organizationName
    }
    this.http.post("register", req).subscribe(
      res => {
          // Hard redirect to the dashboard to load the auth service
          window.location.href = "/dashboard"
      }, err => {
        console.error('Observer got an error: ', err)
      },
    )
  }

  private initForm() {
    this.registerForm = new FormGroup({
      'firstName': new FormControl("Kevin", [Validators.required]),
      'lastName': new FormControl("Roe", [Validators.required]),      
      'email': new FormControl("kroe@admin.com", [Validators.required]),
      'password': new FormControl("pass", [Validators.required]),
      'passwordConfirmation': new FormControl("pass", [Validators.required]),
      'organizationName': new FormControl("Ramsey Solutions", [Validators.required])
    });
  }

}
