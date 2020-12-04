import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TestPlan } from 'src/app/models/test-plan.model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TestPlanResolverService implements Resolve<TestPlan> {

  constructor(private http: HttpService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TestPlan> {
    return this.http.get<TestPlan>(`test_plans/${route.paramMap.get('id')}`)
  }
}
