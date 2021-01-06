import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { Workflow } from 'src/app/models/workflow.model';
import { WorkflowRequest } from 'src/app/requests/workflow.request';
import { HttpService } from 'src/app/services/http.service';
import { JQueryService } from 'src/app/services/j-query.service';
import { TestPlanService } from 'src/app/services/test-plan.service';
declare var $: any;

@Component({
  selector: 'app-edit-workflows',
  templateUrl: './edit-workflows.component.html',
  styleUrls: ['./edit-workflows.component.css']
})
export class EditWorkflowsComponent implements OnInit {
  product: Product
  workflows: Workflow[]
  addWorkflowForm: FormGroup;
  deleteClicked = false

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router, private jQuery: JQueryService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.workflows[0]
      this.workflows = data.workflows[1]

      this.initForm();

      this.initModalJquery();
    })
  }

  private initForm() {
    this.addWorkflowForm = new FormGroup({
      addField: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });
  }

  private initModalJquery() {
    this.jQuery.onModalHide("addWorkflowModal", () => {
      this.addWorkflowForm.reset()
    });
  }
  
  onAddWorkflowSubmit() {
    let req: WorkflowRequest = {
      product_id: this.product.id,
      name: this.addWorkflowForm.value.addField,
    }
    this.http.post<Workflow>(`workflows`, req).subscribe(
      data => {
        this.workflows.push(data)
        this.jQuery.hideModal("addWorkflowModal")
      }, e => {
        this.addWorkflowForm.setErrors({msg: e.error[0]})
      }
    )
  }

}
