import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { WorkflowStep } from 'src/app/models/workflow-step.model';
import { Workflow } from 'src/app/models/workflow.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EditWorkflowStepsResolverService implements Resolve<[Product, Workflow, WorkflowStep[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[Product, Workflow, WorkflowStep[]]> {
    return this.http.get<Workflow>(`workflows/${route.paramMap.get('id')}`).pipe(
      mergeMap(
        workflow => {
          return forkJoin([
            this.http.get<Product>(`products/${workflow.product_id}`),
            of(workflow),
            this.http.get<WorkflowStep[]>(`workflows/${route.paramMap.get('id')}/workflow_steps`)
          ]
        );
      })
    )
  } 
}
