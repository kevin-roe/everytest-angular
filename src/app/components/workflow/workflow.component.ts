import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { WorkflowStep } from 'src/app/models/workflow-step.model';
import { Workflow } from 'src/app/models/workflow.model';
import { WorkflowRequest } from 'src/app/requests/workflow.request';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  product: Product
  workflow: Workflow
  workflow_steps: WorkflowStep[]
  editworkflowForm: FormGroup;
  delete_clicked = false

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.workflow_steps[0]
      this.workflow = data.workflow_steps[1]
      this.workflow_steps = data.workflow_steps[2]

      this.initForm()
    })
  }

  initForm() {
    this.editworkflowForm = new FormGroup({
      'name': new FormControl(this.workflow.name, [Validators.required]),
    })
  }

  onCancel() {
    this.editworkflowForm.get('name').setValue(this.workflow.name)
    $("#editworkflowModal").modal('hide');
  }

  onEditworkflowSubmit() {
    let req: WorkflowRequest = {
      product_id: this.product.id,
      name: this.editworkflowForm.get("name").value
    }
    this.http.put<Workflow>(`workflows/${this.workflow.id}`, req).subscribe(
      data => {
        this.workflow = data
        $("#editworkflowModal").modal('hide');
      }, error => {
        alert("ERROR!!!")
      }
    )
  }

  onDeleteworkflowSubmit() {
    this.http.delete(`workflows/${this.workflow.id}`).subscribe(
      () => {
        $("#editworkflowModal").modal('hide');
        this.router.navigate(['/dashboard'])
      }, error => {
        alert("Error!!!")
      }
    )
  }
}