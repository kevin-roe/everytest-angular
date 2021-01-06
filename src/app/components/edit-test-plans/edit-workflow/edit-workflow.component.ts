import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { WorkflowStep } from 'src/app/models/workflow-step.model';
import { Workflow } from 'src/app/models/workflow.model';
import { WorkflowRequest } from 'src/app/requests/workflow.request';
import { WorkflowStepRequest } from 'src/app/requests/workflow-step.request';
import { HttpService } from 'src/app/services/http.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SpinnerService } from 'src/app/services/spinner.service';
import { JQueryService } from 'src/app/services/j-query.service';

@Component({
  selector: 'app-edit-workflow',
  templateUrl: './edit-workflow.component.html',
  styleUrls: ['./edit-workflow.component.css']
})
export class EditWorkflowComponent implements OnInit {
  product: Product
  workflow: Workflow
  workflowSteps: WorkflowStep[]
  deleteClicked = false;

  // Forms
  editWorkflowForm: FormGroup;
  workflowStepsForm: FormGroup;
  workflowStepsFormArray: FormArray;

  // Notes 
  notesFormToEdit: number
  action: string;
  notes: string;

  // Submit button
  submitButtonText: string = "Save";

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    public router: Router,
    private spinner: SpinnerService,
    private jQuery: JQueryService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.workflowSteps[0]
      this.workflow = data.workflowSteps[1]
      this.workflowSteps = data.workflowSteps[2]

      this.initForm()

      this.initModalJquery();
    })
  }

  getControls() : AbstractControl[] {
    return this.getFormArray().controls;
  }

  getFormArray() : FormArray {
    return this.workflowStepsForm.get('workflowStepsFormArray') as FormArray
  }

  initForm() {
    this.editWorkflowForm = new FormGroup({
      name: new FormControl(this.workflow.name, [Validators.required]),
    })

    this.workflowStepsForm = new FormGroup({
      workflowStepsFormArray: new FormArray([])
    })

    this.workflowSteps.forEach(s => {
      this.getControls().push(new FormGroup({
        id: new FormControl(s.id),
        action: new FormControl(s.action, [Validators.required]),
        order: new FormControl(s.order),
        notes: new FormControl(s.notes)
      }))
    })
  }

  initModalJquery() {
    this.jQuery.onModalHide("editworkflowModal", () => {
      this.editWorkflowForm.controls.name.setValue(this.workflow.name)
    });
  }

  addWorkflowStep() {
    this.getControls().push(new FormGroup({
      action: new FormControl(null, [Validators.required]),
      order: new FormControl(this.getControls().length + 1),
      notes: new FormControl(null)
    }))
    this.markAsDirty()
  }

  reorderFormArray() {
    let i = 1
    this.getControls().forEach(step => {
      step.get('order').patchValue(i)
      i++;
    });
  }

  removeStep(i: number) {
    this.getFormArray().removeAt(i)
    this.reorderFormArray()
    this.markAsDirty()
  }

  drop(event: CdkDragDrop<FormGroup[]>) {
    moveItemInArray(this.getControls(), event.previousIndex, event.currentIndex);
    this.reorderFormArray();
    this.markAsDirty()
  }

  markAsDirty() {
    this.workflowStepsForm.markAsDirty()
    this.submitButtonText = "Save"
  }

  onUpdateWorkflowSteps() {    
    for(let f of this.getControls()) {
      if (f.get('action').invalid) {
        this.workflowStepsForm.setErrors({msg: "All steps must have a valid action!"})
        return;
      }
    }

    let req: WorkflowStepRequest[] = new Array<WorkflowStepRequest>()
    this.getControls().forEach(x => {
      req.push({
        workflow_id: this.workflow.id,
        action: x.get('action').value,
        order: x.get('order').value,
        notes: x.get('notes').value
      })
    })
    
    this.spinner.start();
    this.http.put<WorkflowStep[]>(`workflows/${this.workflow.id}/workflow_steps`, req).subscribe(
      res => {
        this.workflowSteps = res
        this.workflowStepsForm.markAsPristine()
        this.submitButtonText = "Saved!"
      }, err => {
        this.workflowStepsForm.setErrors({msg: "An unknown error has occured"})
      }
    ).add(() => {
      this.spinner.stop();
    });
  }

  openNotesModal(i: number) {
    this.notesFormToEdit = i
    this.action = this.getControls()[this.notesFormToEdit].get("action").value 
    this.notes = this.getControls()[this.notesFormToEdit].get("notes").value
  }

  saveNotes() {
    this.getControls()[this.notesFormToEdit].get("notes").patchValue(this.notes)
    this.jQuery.hideModal("editNotesModal");
    this.markAsDirty()
  }

  notesPresent(control: FormGroup) {
    let value = control.get("notes").value
    if (value == undefined || value == "") {
      return false
    } else {
      return true
    }
  }

  onEditworkflowSubmit() {
    let req: WorkflowRequest = {
      product_id: this.product.id,
      name: this.editWorkflowForm.get("name").value
    }
    this.http.put<Workflow>(`workflows/${this.workflow.id}`, req).subscribe(
      data => {
        this.workflow = data
        this.jQuery.hideModal("editworkflowModal");
      }, e => {
        this.editWorkflowForm.setErrors({msg: e.error[0]})
      }
    )
  }

  onDeleteworkflowSubmit() {
    this.http.delete(`workflows/${this.workflow.id}`).subscribe(
      () => {
        this.jQuery.hideModal("editworkflowModal");
        this.router.navigate(['/edit', 'product', this.product.id, 'workflows'])
      }, e => {
        if (e.status == 409) {
          this.editWorkflowForm.setErrors({msg: "Unable to delete this test suite until all existing test cases and test steps are deleted."})
        } else {
          this.editWorkflowForm.setErrors({msg: "An unknown error has occured."})
        }
        this.deleteClicked = false
      }
    )
  }
}