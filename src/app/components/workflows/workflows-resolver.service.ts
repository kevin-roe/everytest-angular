import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { TestPlan } from 'src/app/models/test-plan.model';
import { Workflow } from 'src/app/models/workflow.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowsResolverService implements Resolve<[TestPlan, Workflow[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[TestPlan, Workflow[]]> {
    let test_plan = this.http.get<TestPlan>(`test_plans/${route.paramMap.get('id')}`);
    let workflows = this.http.get<Workflow[]>(`test_plans/${route.paramMap.get('id')}/workflows`)
    return forkJoin([test_plan, workflows])
  }  
}
