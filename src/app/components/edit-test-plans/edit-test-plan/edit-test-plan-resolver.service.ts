import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EditTestPlanResolverService implements Resolve<[TestPlan, TestSuite[]]> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[TestPlan, TestSuite[]]> {
    let test_plan = this.http.get<TestPlan>(`test_plans/${route.paramMap.get('id')}`);
    let test_suites = this.http.get<TestSuite[]>(`test_plans/${route.paramMap.get('id')}/test_suites`)
    return forkJoin([test_plan, test_suites])
  }  
}
