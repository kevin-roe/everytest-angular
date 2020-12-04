import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestSuiteRequest } from 'src/app/requests/test-suite.request';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'app-test-plan',
  templateUrl: './test-plan.component.html',
  styleUrls: ['./test-plan.component.css']
})
export class TestPlanComponent implements OnInit {
  test_plan: TestPlan;
  test_suites: TestSuite[];
  test_suite: TestSuite;
  editForm: FormGroup;
  addForm: FormGroup;

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit(): void {
    this.initForms()

    this.route.data.subscribe(data => {
      this.test_plan = data.test_plan
      this.test_suites = data.test_plan.test_suites
    })
  }

  setTestSuite(test_suite: TestSuite, setEditForm: boolean) {
    this.test_suite = test_suite
    if (setEditForm) {
      this.editForm.get("editField").setValue(this.test_suite.name)
    }
  }

  private initForms() {
    this.editForm = new FormGroup({
      'editField': new FormControl(null, [Validators.required]),
    });
    this.addForm = new FormGroup({
      'addField': new FormControl(null, [Validators.required]),
    });
  }

  onEditSubmit() {
    let req: TestSuiteRequest = {
      name: this.editForm.value.editField,
    }
    this.http.put<TestSuite>(`test_suites/${this.test_suite.id}`, req).subscribe(
      data => {

        $("#editeModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onDeleteSubmit() {
    this.http.delete(`test_suites/${this.test_suite.id}`).subscribe(
      () => {

        $("#deleteTestSuiteModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onAddSubmit() {
    let req: TestSuiteRequest = {
      name: this.addForm.value.addField,
    }
    this.http.post<TestSuite>(`test_suites`, req).subscribe(
      data => {

        $("#addTestSuiteModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

}
