import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestCase } from 'src/app/models/test-case.model';
import { TestPlan } from 'src/app/models/test-plan.model';
import { TestStep } from 'src/app/models/test-step.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestCaseRequest } from 'src/app/requests/test-case.request';
import { HttpService } from 'src/app/services/http.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SpinnerService } from 'src/app/services/spinner.service';
import { JQueryService } from 'src/app/services/j-query.service';
import { TestStepRequest } from 'src/app/requests/test-step.request';
import { Workflow } from 'src/app/models/workflow.model';
declare var $: any;

@Component({
  selector: 'app-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.css']
})
export class TestCaseComponent implements OnInit {
  workflows: Workflow[]
  testPlan: TestPlan
  testSuite: TestSuite
  testCase: TestCase
  testSteps: TestStep[]
  deleteClicked = false

  // Forms
  editTestCaseForm: FormGroup;
  testStepsForm: FormGroup;
  testStepsFormArray: FormArray;

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
    private jQuery: JQueryService,
    private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.workflows = data.test_case[0],
      this.testPlan = data.test_case[1]
      this.testSuite = data.test_case[2]
      this.testCase = data.test_case[3]
      this.testSteps = data.test_case[4]

      this.initForms()
    })
  }

  getControls() : AbstractControl[] {
    return this.getFormArray().controls;
  }

  getFormArray() : FormArray {
    return this.testStepsForm.get('testStepsFormArray') as FormArray
  }

  initForms() {
    this.editTestCaseForm = new FormGroup({
      name: new FormControl(this.testCase.name, [Validators.required]),
      mets: new FormControl(this.testCase.mets_id, [Validators.required])
    })

    this.testStepsForm = new FormGroup({
      testStepsFormArray: new FormArray([])
    })

    this.initData()
  }

  initData() {
    this.testSteps.forEach(s => {
      this.getControls().push(new FormGroup({
        is_workflow_step: new FormControl(s.workflow_id != null? true : false),
        action: new FormControl(s.action),
        workflow: new FormControl(s.workflow_id),
        order: new FormControl(s.order),
        notes: new FormControl(s.notes)
      }))
    })
  }

  addTestStep() {
    this.getControls().push(new FormGroup({
      is_workflow_step: new FormControl(false),
      action: new FormControl(null),
      workflow: new FormControl(null),
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
    this.testStepsForm.markAsDirty()
    this.submitButtonText = "Save"
  }

  changeStep(control: AbstractControl) {
    if (control.get("is_workflow_step").value) {
      control.get("is_workflow_step").patchValue(false)
      control.get("workflow").patchValue(null)
    } else {
      control.get("is_workflow_step").patchValue(true)
      control.get("action").patchValue(null)
    }
  }

  onUpdateTestSteps() {    
    let error = false
    for (let c of this.getControls()) {
      if (c.get("is_workflow_step").value && c.get("workflow").value == null) {
        error = true
      } else if (!c.get("is_workflow_step").value && (c.get("action").value == null || c.get("action").value == "")) {
        error = true
      }
    }
    if (error) {
      this.jQuery.toast("error-toast", 5000)
      return
    }

    let req: TestStepRequest[] = new Array<TestStepRequest>()
    this.getControls().forEach(x => {
      req.push({
        test_case_id: this.testCase.id,
        action: x.get('action').value,
        workflow_id: x.get('workflow').value,
        order: x.get('order').value,
        notes: x.get('notes').value
      })
    })
    
    this.spinner.start();
    this.http.put<TestStep[]>(`test_cases/${this.testCase.id}/test_steps`, req).subscribe(
      res => {
        this.testSteps = res
        this.testStepsForm.markAsPristine()
        this.submitButtonText = "Saved!"
      }, err => {
        alert("could not save!")
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

  onCancel() {
    this.editTestCaseForm.get('name').setValue(this.testCase.name)
    this.jQuery.hideModal("editTestCaseModal");

    this.notes = "";
    this.jQuery.hideModal("editNotesModal");
  }

  onEditTestCaseSubmit() {
    let req: TestCaseRequest = {
      test_suite_id: this.testSuite.id,
      name: this.editTestCaseForm.get("name").value,
      mets_id: this.editTestCaseForm.get("mets").value
    }
    this.http.put<TestCase>(`test_cases/${this.testCase.id}`, req).subscribe(
      data => {
        this.testCase = data
        this.jQuery.hideModal("editTestCaseModal");
      }, error => {
        alert("ERROR!!!")
      }
    )
  }

  onDeleteTestCaseSubmit() {
    this.http.delete(`test_cases/${this.testCase.id}`).subscribe(
      () => {
        this.jQuery.hideModal("editTestCaseModal");
        this.router.navigate(['/test_suite', this.testSuite.id])
      }, error => {
        alert("Error!!!")
      }
    )
  }

}
