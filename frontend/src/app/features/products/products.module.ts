import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './components/list/product-list.component';
import { ProductDetailComponent } from './components/detail/product-detail.component';
import { ProductFormComponent } from './components/form/product-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent, ProductFormComponent],
  imports: [CommonModule, ReactiveFormsModule, ProductsRoutingModule, SharedModule]
})
export class ProductsModule {}
