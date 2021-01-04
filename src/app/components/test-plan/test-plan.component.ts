import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestRunStep } from 'src/app/models/test-run-steps.model';
import { SavedTestRun } from 'src/app/models/test-run.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestRunRequest, TestRunStepRequest } from 'src/app/requests/test_run.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { JQueryService } from 'src/app/services/j-query.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-test-plan',
  templateUrl: './test-plan.component.html',
  styleUrls: ['./test-plan.component.css']
})
export class TestPlanComponent implements OnInit {
  test_plan: TestPlan;
  test_suites: TestSuite[];
  test_cases: TestCase[];
  selectedTestSuite: number;
  selectedTestCase: number;
  test_run_selected = false;

  test_run_steps: TestRunStep[];

  testRunForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private authService: AuthService,
    private jquery: JQueryService,
    private spinner: SpinnerService ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.test_plan[0]
      this.test_suites = data.test_plan[1]

      this.test_cases = new Array<TestCase>()
      this.selectedTestSuite = null;
      this.selectedTestCase = null
    })
  }

  getControls() : AbstractControl[] {
    return this.getFormArray().controls;
  }

  getFormArray() : FormArray {
    return this.testRunForm.get('testRunFormArray') as FormArray
  }

  initForm() {
    this.testRunForm = new FormGroup({
      testRunFormArray: new FormArray([])
    })
  }

  initData() {
    this.test_run_steps.forEach(s => {
      this.getControls().push(new FormGroup({
        order: new FormControl(s.order),
        action: new FormControl(s.action),
        workflow: new FormControl(s.workflow),
        notes: new FormControl(s.notes),
        result: new FormControl(null, [Validators.required])
      }))
    })
  }

  onTestSuiteChange(test_suite_id: number) {
    this.http.get<TestCase[]>(`test_suites/${test_suite_id}/test_cases?with_test_steps=true`).subscribe(res => {
      this.test_cases = res
      this.selectedTestCase = null
    })
  }

  setTestRun() {
    this.http.get<TestRunStep[]>(`test_run/${this.selectedTestCase}`).subscribe(res => {
      this.test_run_steps = res
      this.initForm()
      this.initData()
      this.test_run_selected = true
    })
  }

  onCreateTestRun() {
    for (let c of this.getControls()) {
      if (c.get("result").value == null) {
        alert("All test steps must have a result")
        return;
      }
    }

    let result = 1;
    let steps: TestRunStepRequest[] = new Array<TestRunStepRequest>();
    this.getControls().forEach(c => {
      if (c.get("result").value == 2) {
        result = 2;
      }

      let step: TestRunStepRequest = {
        order: c.get("order").value,
        action: c.get("action").value,
        workflow: c.get("workflow").value,
        notes: c.get("notes").value,
        result: c.get("result").value,
      }
      steps.push(step)
    })

    let req: TestRunRequest = {
      test_run: {
        test_case_id: +this.selectedTestCase,
        user_id: this.authService.user$.id,
        notes: null,
        result: result,
      },
      test_run_steps: steps
    }

    this.spinner.start()
    this.http.post<SavedTestRun>(`test_run/${this.selectedTestCase}`, req).subscribe(() => {
      this.getControls().forEach(c => {
        c.get("result").patchValue(null)
      })
      this.jquery.toast("success-toast", 3000)
    }, () => {
        alert("Could not save test run!")
    }).add(() => {
      this.spinner.stop();
    });
  }

  setPass(index: number) {
    if (this.getControls()[index].get("result").value == 2) {
      this.getControls()[index].get("result").patchValue(1)
    } else {
      this.getControls().forEach((control, i) => {
        if (index >= i) {
          if (control.get("result").value == null) {
            control.get("result").patchValue(1);
          }
        }
      })
    }
  }

  setFail(index: number) {
    this.getControls()[index].get("result").patchValue(2);
  }
}
