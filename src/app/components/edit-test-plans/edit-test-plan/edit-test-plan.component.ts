import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestPlanRequest } from 'src/app/requests/test-plan.request';
import { TestSuiteRequest } from 'src/app/requests/test-suite.request';
import { HttpService } from 'src/app/services/http.service';
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

  constructor(private route: ActivatedRoute, private http: HttpService, public testPlanService: TestPlanService, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.test_plan[0]
      this.test_suites = data.test_plan[1]

      this.initForms()
    })
  }

  private initForms() {
    this.editTestPlanForm = new FormGroup({
      'product': new FormControl(this.test_plan.product.id, [Validators.required]),
      'platform': new FormControl(this.test_plan.platform.id, [Validators.required]),
    })
    this.addTestSuiteForm = new FormGroup({
      'addField': new FormControl(null, [Validators.required]),
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
        $("#editTestPlanModal").modal('hide');
      }, errors => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onCancel() {
    this.editTestPlanForm.get('product').setValue(this.test_plan.product.id)
    this.editTestPlanForm.get('platform').setValue(this.test_plan.platform.id)
    $("#editTestPlanModal").modal('hide');
    this.addTestSuiteForm.reset()
    $("#addTestSuiteModal").modal('hide');
    this.deleteClicked = false
  }

  deleteTestPlan() {
    this.http.delete(`test_plans/${this.test_plan.id}`).subscribe(
      () => {
        this.testPlanService.deleteTestPlan(this.test_plan.id)
        this.testPlanService.updateSideNavMenu()
        $("#editTestPlanModal").modal('hide');
        this.router.navigate(['/dashboard'])
      }, errors => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
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
        this.addTestSuiteForm.reset();
        $("#addTestSuiteModal").modal('hide');
      }, errors => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }










}
