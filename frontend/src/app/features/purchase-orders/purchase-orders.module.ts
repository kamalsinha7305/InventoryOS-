import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseOrdersRoutingModule } from './purchase-orders-routing.module';
import { PurchaseOrderListComponent } from './components/list/purchase-order-list.component';
import { PurchaseOrderDetailComponent } from './components/detail/purchase-order-detail.component';
import { PurchaseOrderFormComponent } from './components/form/purchase-order-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PurchaseOrderListComponent, PurchaseOrderDetailComponent, PurchaseOrderFormComponent],
  imports: [CommonModule, ReactiveFormsModule, PurchaseOrdersRoutingModule, SharedModule]
})
export class PurchaseOrdersModule {}
