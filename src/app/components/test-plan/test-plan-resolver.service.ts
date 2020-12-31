import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TestPlanResolverService implements Resolve<[TestPlan, TestSuite[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[TestPlan, TestSuite[]]> {
    let test_plan = this.http.get<TestPlan>(`test_plans/${route.paramMap.get('id')}`);
    let test_suites = this.http.get<TestSuite[]>(`test_plans/${route.paramMap.get('id')}/test_suites?with_test_cases=true`)
    return forkJoin([test_plan, test_suites])
  }  
}
