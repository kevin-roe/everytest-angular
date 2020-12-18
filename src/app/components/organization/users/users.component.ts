import { constructorParametersDownlevelTransform } from '@angular/compiler-cli';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserRequest } from 'src/app/requests/user.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  user: User;
  editUserForm: FormGroup;
  newUserForm: FormGroup;

  constructor(public authService: AuthService, private http: HttpService) { }

  ngOnInit(): void {
    this.http.get<User[]>(`users`).subscribe(users => {
      this.users = users
    });

    this.initForms();
  }

  initForms() {
    this.editUserForm = new FormGroup({
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null),
      'password_confirmation': new FormControl(null),
      'admin': new FormControl(false, [Validators.required]),
    });

    this.newUserForm = new FormGroup({
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null),
      'password_confirmation': new FormControl(null),
      'admin': new FormControl(false, [Validators.required]),
    });
  }
  
  onCancel() {
    this.newUserForm.reset();
    $("#addUserModal").modal('hide');
    this.editUserForm.reset();
    $("#editUserModal").modal('hide');
  }

  setUser(user: User, setEditForm: boolean) {
    this.user = user
    if (setEditForm) {
      this.editUserForm.patchValue(user)
    }
  }

  onEditSubmit() {
    let req: UserRequest = {
      first_name: this.editUserForm.value.first_name,
      last_name: this.editUserForm.value.last_name,
      email: this.editUserForm.value.email,
      password: this.editUserForm.value.password,
      password_confirmation: this.editUserForm.value.password_confirmation,
      admin: this.editUserForm.value.admin
    }
    this.http.put<User>(`users/${this.user.id}`, req).subscribe(
      user => {
        let index = this.users.findIndex(x => x.id == this.user.id);
        this.users[index] = user
        this.onCancel();
      }, err => {
        console.log(err.error)
        alert(err.error)
      })
  }

  onAddSubmit() {
    let req: UserRequest = {
      first_name: this.newUserForm.value.first_name,
      last_name: this.newUserForm.value.last_name,
      email: this.newUserForm.value.email,
      password: this.newUserForm.value.password,
      password_confirmation: this.newUserForm.value.password_confirmation,
      admin: this.newUserForm.value.admin
    }
    this.http.post<User>("users", req).subscribe(
      user => {
        this.users.push(user)
        this.onCancel();
      }, () => {
        alert("Error!")
      })
  }

  onDeleteSubmit() {
    this.http.delete(`users/${this.user.id}`).subscribe(
      () => {
        this.users = this.users.filter(x => x.id != this.user.id);
        this.user= null; // Just in case
        $("#deleteUserModal").modal('hide');
      }, () => {
        alert("Error!")
      }
    )
  }

}
