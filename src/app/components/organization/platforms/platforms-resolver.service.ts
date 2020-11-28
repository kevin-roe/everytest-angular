import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Platform } from 'src/app/models/platform.model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformsResolverService implements Resolve<Platform[]>{

  constructor(private authService: AuthService, private http: HttpService) { }

  resolve(): Observable<Platform[]> {
    return this.http.get<Platform[]>(`platforms/${this.authService.user$.organization.id}`)
  }
}
