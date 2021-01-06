import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestPlanRequest } from 'src/app/requests/test-plan.request';
import { TestSuiteRequest } from 'src/app/requests/test-suite.request';
import { HttpService } from 'src/app/services/http.service';
import { JQueryService } from 'src/app/services/j-query.service';
import { TestPlanService } from 'src/app/services/test-plan.service';
declare var $: any;

@Component({
  selector: 'app-edit-test-plan',
  templateUrl: './edit-test-plan.component.html',
  styleUrls: ['./edit-test-plan.component.css']
})
export class EditTestPlanComponent implements OnInit {
  test_plan: TestPlan;
  test_suites: TestSuite[];
  editTestPlanForm: FormGroup;
  addTestSuiteForm: FormGroup;
  deleteClicked = false

  constructor(private route: ActivatedRoute, private http: HttpService, public testPlanService: TestPlanService, private router: Router, private jQuery: JQueryService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.test_plan[0]
      this.test_suites = data.test_plan[1]

      this.initForms()

      this.initModalOnHide()
    })
  }

  private initForms() {
    this.editTestPlanForm = new FormGroup({
      'product': new FormControl(this.test_plan.product.id, [Validators.required]),
      'platform': new FormControl(this.test_plan.platform.id, [Validators.required]),
    })
    this.addTestSuiteForm = new FormGroup({
      'addField': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });
  }

  private initModalOnHide() {
    this.jQuery.onModalHide("editTestPlanModal", () => {
      this.editTestPlanForm.reset();
      this.editTestPlanForm.get('product').setValue(this.test_plan.product.id)
      this.editTestPlanForm.get('platform').setValue(this.test_plan.platform.id)
      this.deleteClicked = false
    });

    this.jQuery.onModalHide("addTestSuiteModal", () => {
      this.addTestSuiteForm.reset();
      this.deleteClicked = false
    });
  }

  onEditTestPlanSubmit() {
    this.deleteClicked = false
    let req: TestPlanRequest = {
      product_id: this.editTestPlanForm.get("product").value,
      platform_id: this.editTestPlanForm.get("platform").value
    }
    this.http.put<TestPlan>(`test_plans/${this.test_plan.id}`, req).subscribe(
      data => {
        this.test_plan = data
        this.testPlanService.updateTestPlan(data)
        this.testPlanService.updateSideNavMenu()
        this.jQuery.hideModal("editTestPlanModal")
      }, (e: HttpErrorResponse) => {
        this.editTestPlanForm.setErrors({msg: e.error[0].replace("Product", "Test Plan")})
      }
    )
  }

  deleteTestPlan() {
    this.http.delete(`test_plans/${this.test_plan.id}`).subscribe(
      () => {
        this.testPlanService.deleteTestPlan(this.test_plan.id)
        this.testPlanService.updateSideNavMenu()
        this.jQuery.hideModal("editTestPlanModal")
        this.router.navigate(['/dashboard'])
      }, (e: HttpErrorResponse) => {
        if (e.status == 409) {
          this.editTestPlanForm.setErrors({msg: "Unable to delete this test plan until all existing test suites, test cases, etc are deleted."})
        } else {
          this.editTestPlanForm.setErrors({msg: "An unknown error has occured."})
        }
        this.deleteClicked = false
      }
    )
  }

  onAddTestSuiteSubmit() {
    let req: TestSuiteRequest = {
      test_plan_id: this.test_plan.id,
      name: this.addTestSuiteForm.value.addField,
    }
    this.http.post<TestSuite>(`test_suites`, req).subscribe(
      data => {
        this.test_suites.push(data)
        this.jQuery.hideModal("addTestSuiteModal")
      }, (e: HttpErrorResponse) => {
        this.addTestSuiteForm.setErrors({ msg: e.error[0] })
      }
    )
  }
}
