import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { HttpService } from 'src/app/services/http.service';
import { TestPlanService } from 'src/app/services/test-plan.service';

@Component({
  selector: 'app-test-plan',
  templateUrl: './test-plan.component.html',
  styleUrls: ['./test-plan.component.css']
})
export class TestPlanComponent implements OnInit {
  test_plan: TestPlan;
  test_suites: TestSuite[];
  test_cases: TestCase[];

  test_case_id: number;

  constructor(private route: ActivatedRoute, private http: HttpService, public testPlanService: TestPlanService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.test_plan[0]
      this.test_suites = data.test_plan[1]
    })

    this.test_cases = new Array<TestCase>()
  }

  onTestSuiteChange(test_suite_id: number) {
    this.http.get<TestCase[]>(`test_suites/${test_suite_id}/test_cases`).subscribe(res => {
      this.test_cases = res
      this.test_case_id = null
    })
  }

  onTestCaseChange(test_case_id: number) {
    this.test_case_id = test_case_id
  }

}
