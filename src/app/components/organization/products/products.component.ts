import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductRequest } from 'src/app/requests/product.request';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
declare var $: any;

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @Input() products: Product[]
  product: Product
  editProductForm: FormGroup;
  addProductForm: FormGroup;

  constructor(private authService: AuthService, private http: HttpService) { }

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
    this.http.put<Product>(`products/${this.authService.user$.organization.id}/${this.product.id}`, req).subscribe(
      data => {
        this.products.find(p => p.id === data.id).name = data.name;
        $("#editProductModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

  onDeleteSubmit() {
    this.http.delete(`products/${this.authService.user$.organization.id}/${this.product.id}`).subscribe(
      () => {
        this.products = this.products.filter(p => p.id != this.product.id);
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
    this.http.post<Product>(`products/${this.authService.user$.organization.id}`, req).subscribe(
      data => {
        this.products.push(data)
        $("#addProductModal").modal('hide');
      }, () => {
        alert("Error! (Need to handle these better...)") //TODO: Handle errors
      }
    )
  }

}
