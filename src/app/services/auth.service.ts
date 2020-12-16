import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { LoginRequest } from '../requests/login.request.model';
import { LoggedInResponse } from '../responses/logged-in.response.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ : User

  constructor(private http: HttpService, private router: Router) { 
    this.loggedIn().subscribe((data: User)=>{
      this.user$ = data
    })
  }

  loggedIn() {
    return this.http.get<User>("logged_in")
  }

  login(req : LoginRequest) {
    return this.http.post<User>("sessions", req).subscribe((data: User) => {
      this.user$ = data
      this.router.navigate(['/dashboard'])
    })
  }

  logout() {
    this.http.delete("logout").subscribe(()=>{
      this.user$ = null
      this.router.navigate(['/login'])
    })
  }
  
}
