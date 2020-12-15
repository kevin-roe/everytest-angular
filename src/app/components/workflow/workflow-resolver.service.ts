import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TestPlan } from 'src/app/models/test-plan.model';
import { WorkflowStep } from 'src/app/models/workflow-step.model';
import { Workflow } from 'src/app/models/workflow.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowStepsResolverService implements Resolve<[TestPlan, Workflow, WorkflowStep[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[TestPlan, Workflow, WorkflowStep[]]> {
    return this.http.get<Workflow>(`workflows/${route.paramMap.get('id')}`).pipe(
      mergeMap(
        workflow => {
          return forkJoin([
            this.http.get<TestPlan>(`test_plans/${workflow.test_plan_id}`),
            of(workflow),
            this.http.get<WorkflowStep[]>(`workflows/${route.paramMap.get('id')}/workflow_steps`)
          ]
        );
      })
    )
  } 
}
