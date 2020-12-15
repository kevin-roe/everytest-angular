import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestCaseRequest } from 'src/app/requests/test-case.request';
import { TestSuiteRequest } from 'src/app/requests/test-suite.request';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'app-test-suite',
  templateUrl: './test-suite.component.html',
  styleUrls: ['./test-suite.component.css']
})
export class TestSuiteComponent implements OnInit {
  test_plan: TestPlan
  test_suite: TestSuite
  test_cases: TestCase[]
  editTestSuiteForm: FormGroup
  addTestCaseForm: FormGroup
  delete_clicked = false

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.test_suite[0]
      this.test_suite = data.test_suite[1]
      this.test_cases = data.test_suite[2]

      this.initForms()
    })
  }

  initForms() {
    this.editTestSuiteForm = new FormGroup({
      'name': new FormControl(this.test_suite.name, [Validators.required]),
    })
    this.addTestCaseForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'mets': new FormControl(null, [Validators.required]),
    });
  }

  onEditTestSuiteSubmit() {
    let req: TestSuiteRequest = {
      test_plan_id: this.test_plan.id,
      name: this.editTestSuiteForm.get("name").value
    }
    this.http.put<TestSuite>(`test_suites/${this.test_suite.id}`, req).subscribe(
      data => {
        this.test_suite = data
        $("#editTestSuiteModal").modal('hide');
      }, error => {
        alert("ERROR!!!")
      }
    )
  }

  onDeleteTestSuiteSubmit() {
    this.http.delete(`test_suites/${this.test_suite.id}`).subscribe(
      () => {
        $("#editTestSuiteModal").modal('hide');
        this.router.navigate(['/test_plan', this.test_plan.id])
      }, error => {
        alert("Error!!!")
      }
    )
  }

  onAddTestCaseSubmit() {
    let req: TestCaseRequest = {
      test_suite_id: this.test_suite.id,
      name: this.addTestCaseForm.get('name').value,
      mets_id: this.addTestCaseForm.get('mets').value
    }
    this.http.post<TestCase>(`test_cases`, req).subscribe(
      data => {
        this.test_cases.push(data)
        $("#addTestCaseModal").modal('hide');
      }, error => {
        alert("Error!")
      }
    )
  }

}
