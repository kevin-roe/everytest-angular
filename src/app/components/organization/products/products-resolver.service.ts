import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsResolverService implements Resolve<Product[]>{

  constructor(private authService: AuthService, private http: HttpService) { }

  resolve(): Observable<Product[]> {
    return this.http.get<Product[]>(`products/${this.authService.user$.organization.id}`)
  }
}
