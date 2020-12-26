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
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  product: Product
  workflow: Workflow
  workflow_steps: WorkflowStep[]
  delete_clicked = false;

  // Forms
  edit_workflow_form: FormGroup;
  workflow_steps_form: FormGroup;
  workflow_steps_form_array: FormArray;

  // Notes 
  notesFormToEdit: number
  action: string;
  notes: string;

  // Submit button
  submitButtonText: string = "Save";

  constructor(private route: ActivatedRoute, private http: HttpService, public router: Router, private spinner: SpinnerService, private jQuery: JQueryService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.product = data.workflow_steps[0]
      this.workflow = data.workflow_steps[1]
      this.workflow_steps = data.workflow_steps[2]

      this.initForm()

      this.jQuery.initTooltips()
    })
  }

  getControls() : AbstractControl[] {
    return this.getFormArray().controls;
  }

  getFormArray() : FormArray {
    return this.workflow_steps_form.get('workflow_steps_form_array') as FormArray
  }

  initForm() {
    this.edit_workflow_form = new FormGroup({
      name: new FormControl(this.workflow.name, [Validators.required]),
    })

    this.workflow_steps_form = new FormGroup({
      workflow_steps_form_array: new FormArray([])
    })

    this.workflow_steps.forEach(s => {
      this.getControls().push(new FormGroup({
        id: new FormControl(s.id),
        action: new FormControl(s.action, [Validators.required]),
        order: new FormControl(s.order),
        notes: new FormControl(s.notes)
      }))
    })
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
    this.workflow_steps_form.markAsDirty()
    this.submitButtonText = "Save"
  }

  onUpdateWorkflowSteps() {    
    for(let f of this.getControls()) {
      if (f.get('action').invalid) {
        alert("All Steps must have a valid action!")
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
        this.workflow_steps = res
        this.workflow_steps_form.markAsPristine()
        this.submitButtonText = "Saved!"
      }, err => {
        alert("could not save!")
      }
    ).add(() => {
      this.spinner.stop();
    });
  }

  debug() {
    console.log(this.getControls())
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

  onCancel() {
    this.edit_workflow_form.get('name').setValue(this.workflow.name)
    this.jQuery.hideModal("editworkflowModal");

    this.notes = "";
    this.jQuery.hideModal("editNotesModal");
  }

  onEditworkflowSubmit() {
    let req: WorkflowRequest = {
      product_id: this.product.id,
      name: this.edit_workflow_form.get("name").value
    }
    this.http.put<Workflow>(`workflows/${this.workflow.id}`, req).subscribe(
      data => {
        this.workflow = data
        this.jQuery.hideModal("editworkflowModal");
      }, error => {
        alert("ERROR!!!")
      }
    )
  }

  onDeleteworkflowSubmit() {
    this.http.delete(`workflows/${this.workflow.id}`).subscribe(
      () => {
        this.jQuery.hideModal("editworkflowModal");
        this.router.navigate(['/dashboard'])
      }, error => {
        alert("Error!!!")
      }
    )
  }
}