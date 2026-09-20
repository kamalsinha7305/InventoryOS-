import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/list/product-list.component';
import { ProductDetailComponent } from './components/detail/product-detail.component';
import { ProductFormComponent } from './components/form/product-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent, canActivate: [AuthGuard] },
  {
    path: 'create',
    component: ProductFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  { path: ':id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  {
    path: ':id/edit',
    component: ProductFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin', 'Manager'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
