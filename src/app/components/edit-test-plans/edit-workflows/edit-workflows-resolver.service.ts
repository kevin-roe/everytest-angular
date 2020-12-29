import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { Workflow } from 'src/app/models/workflow.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EditWorkflowsResolverService implements Resolve<[Product, Workflow[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[Product, Workflow[]]> {
    let product = this.http.get<Product>(`products/${route.paramMap.get('id')}`);
    let workflows = this.http.get<Workflow[]>(`products/${route.paramMap.get('id')}/workflows`)
    return forkJoin([product, workflows])
  }  
}
