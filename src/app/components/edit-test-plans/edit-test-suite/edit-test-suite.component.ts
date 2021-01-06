import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestCaseRequest } from 'src/app/requests/test-case.request';
import { TestSuiteRequest } from 'src/app/requests/test-suite.request';
import { HttpService } from 'src/app/services/http.service';
import { JQueryService } from 'src/app/services/j-query.service';
declare var $: any;

@Component({
  selector: 'edit-app-test-suite',
  templateUrl: './edit-test-suite.component.html',
  styleUrls: ['./edit-test-suite.component.css']
})
export class EditTestSuiteComponent implements OnInit {
  test_plan: TestPlan
  test_suite: TestSuite
  test_cases: TestCase[]
  editTestSuiteForm: FormGroup
  addTestCaseForm: FormGroup
  deleteClicked = false

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router, private jQuery: JQueryService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.test_suite[0]
      this.test_suite = data.test_suite[1]
      this.test_cases = data.test_suite[2]

      this.initForms()

      this.initModalJquery();
    })
  }

  private initForms() {
    this.editTestSuiteForm = new FormGroup({
      'name': new FormControl(this.test_suite.name, [Validators.required, Validators.minLength(3)]),
    })
    this.addTestCaseForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'mets': new FormControl(null, [Validators.required]),
    });
  }

  private initModalJquery() {
    this.jQuery.onModalHide("editTestSuiteModal", () => {
      this.editTestSuiteForm.controls.name.setValue(this.test_suite.name)
      this.deleteClicked = false
    });

    this.jQuery.onModalHide("addTestCaseModal", () => {
      this.addTestCaseForm.reset();
      this.deleteClicked = false
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
        this.jQuery.hideModal("editTestSuiteModal");
      }, e => {
        this.editTestSuiteForm.setErrors({msg: e.error[0]})
      }
    )
  }

  onDeleteTestSuiteSubmit() {
    this.http.delete(`test_suites/${this.test_suite.id}`).subscribe(
      () => {
        this.jQuery.hideModal("editTestSuiteModal");
        this.router.navigate(['/edit','test_plan', this.test_plan.id])
      }, e => {
        if (e.status == 409) {
          this.editTestSuiteForm.setErrors({msg: "Unable to delete this test suite until all existing test cases and test steps are deleted."})
        } else {
          this.editTestSuiteForm.setErrors({msg: "An unknown error has occured."})
        }
        this.deleteClicked = false
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
        this.jQuery.hideModal("addTestCaseModal")
      }, e => {
        this.addTestCaseForm.setErrors({msg: e.error[0]})
      }
    )
  }
}
