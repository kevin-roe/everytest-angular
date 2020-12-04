import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductRequest } from 'src/app/requests/product.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { TestPlanService } from 'src/app/services/test-plan.service';
declare var $: any;

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  product: Product
  editProductForm: FormGroup;
  addProductForm: FormGroup;

  constructor(private http: HttpService, public testPlanService: TestPlanService) { }

  ngOnInit(): void {
    this.initForms()
  }

  setProduct(product: Product, setEditForm: boolean) {
    this.product = product
    if (setEditForm) {
      this.editProductForm.get("editField").setValue(this.product.name)
    }
  }

  private initForms() {
    this.editProductForm = new FormGroup({
      'editField': new FormControl(null, [Validators.required]),
    });
    this.addProductForm = new FormGroup({
      'addField': new FormControl(null, [Validators.required]),
    });
  }

  onEditSubmit() {
    let req: ProductRequest = {
      name: this.editProductForm.value.editField,
    }
    this.http.put<Product>(`products/${this.product.id}`, req).subscribe(
      data => {
        this.testPlanService.products.find(p => p.id === data.id).name = data.name;
        $("#editProductModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onDeleteSubmit() {
    this.http.delete(`products/${this.product.id}`).subscribe(
      () => {
        this.testPlanService.products = this.testPlanService.products.filter(p => p.id != this.product.id);
        this.product = null; // Just in case
        $("#deleteProductModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onAddSubmit() {
    let req: ProductRequest = {
      name: this.addProductForm.value.addField,
    }
    this.http.post<Product>(`products`, req).subscribe(
      data => {
        this.testPlanService.products.push(data)
        this.addProductForm.reset();
        $("#addProductModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

}
