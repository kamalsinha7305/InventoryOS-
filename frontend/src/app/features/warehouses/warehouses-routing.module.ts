import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseListComponent } from './components/list/warehouse-list.component';
import { WarehouseDetailComponent } from './components/detail/warehouse-detail.component';
import { WarehouseFormComponent } from './components/form/warehouse-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: WarehouseListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: WarehouseFormComponent, canActivate: [AuthGuard] },
  { path: ':id', component: WarehouseDetailComponent, canActivate: [AuthGuard] },
  { path: ':id/edit', component: WarehouseFormComponent, canActivate: [AuthGuard] }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class WarehousesRoutingModule {}
