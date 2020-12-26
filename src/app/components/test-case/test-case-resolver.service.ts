import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestStep } from 'src/app/models/test-step.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Workflow } from 'src/app/models/workflow.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TestCaseResolverService implements Resolve<[Workflow[], TestPlan, TestSuite, TestCase, TestStep[]]> {

  constructor(private http: HttpService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[Workflow[], TestPlan, TestSuite, TestCase, TestStep[]]> {

    return this.http.get<TestCase>(`test_cases/${route.paramMap.get('id')}`).pipe(
      mergeMap(test_case => {
        return this.http.get<TestSuite>(`test_suites/${test_case.test_suite_id}`).pipe(
          mergeMap(test_suite => {
            return this.http.get<TestPlan>(`test_plans/${test_suite.test_plan_id}`).pipe(
              mergeMap(test_plan => {
                return forkJoin([
                  this.http.get<Workflow[]>(`products/${test_plan.product.id}/workflows`),
                  of(test_plan),
                  of(test_suite),
                  of(test_case),
                  this.http.get<TestStep[]>(`test_cases/${route.paramMap.get('id')}/test_steps`)
                ])
              })
            )
          })
        )
      })
    )
  }
}
