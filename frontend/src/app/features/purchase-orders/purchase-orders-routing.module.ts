import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './components/list/purchase-order-list.component';
import { PurchaseOrderDetailComponent } from './components/detail/purchase-order-detail.component';
import { PurchaseOrderFormComponent } from './components/form/purchase-order-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: PurchaseOrderListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: PurchaseOrderFormComponent, canActivate: [AuthGuard] },
  { path: ':id', component: PurchaseOrderDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class PurchaseOrdersRoutingModule {}
