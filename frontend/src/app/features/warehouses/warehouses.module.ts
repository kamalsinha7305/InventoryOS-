import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehouseListComponent } from './components/list/warehouse-list.component';
import { WarehouseDetailComponent } from './components/detail/warehouse-detail.component';
import { WarehouseFormComponent } from './components/form/warehouse-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [WarehouseListComponent, WarehouseDetailComponent, WarehouseFormComponent],
  imports: [CommonModule, ReactiveFormsModule, WarehousesRoutingModule, SharedModule]
})
export class WarehousesModule {}
