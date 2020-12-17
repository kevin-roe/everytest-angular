import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestPlan } from 'src/app/models/test-plan.model';
import { Workflow } from 'src/app/models/workflow.model';
import { WorkflowRequest } from 'src/app/requests/workflow.request';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit {
  test_plan: TestPlan
  workflows: Workflow[]
  addWorkflowForm: FormGroup;
  delete_clicked = false

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.test_plan = data.workflows[0]
      this.workflows = data.workflows[1]

      this.initForm()
    })
  }

  private initForm() {
    this.addWorkflowForm = new FormGroup({
      'addField': new FormControl(null, [Validators.required]),
    });
  }

  onCancel() {
    this.addWorkflowForm.reset();
    $("#addWorkflowModal").modal('hide');
  }
  
  onAddWorkflowSubmit() {
    let req: WorkflowRequest = {
      test_plan_id: this.test_plan.id,
      name: this.addWorkflowForm.value.addField,
    }
    this.http.post<Workflow>(`workflows`, req).subscribe(
      data => {
        this.workflows.push(data)
        this.addWorkflowForm.reset();
        $("#addWorkflowModal").modal('hide');
      }, errors => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

}
