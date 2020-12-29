import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EditTestSuiteResolverService implements Resolve<[TestPlan, TestSuite, TestCase[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[TestPlan, TestSuite, TestCase[]]> {
    return this.http.get<TestSuite>(`test_suites/${route.paramMap.get('id')}`).pipe(
      mergeMap(
        test_suite => {
          return forkJoin([
            this.http.get<TestPlan>(`test_plans/${test_suite.test_plan_id}`),
            of(test_suite),
            this.http.get<TestCase[]>(`test_suites/${route.paramMap.get('id')}/test_cases`)
          ]
        );
      })
    )
  } 
}
