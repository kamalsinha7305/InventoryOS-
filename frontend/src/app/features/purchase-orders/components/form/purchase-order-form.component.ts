import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { SuppliersService } from '../../../products/services/suppliers.service';
import { WarehousesService } from '../../../warehouses/services/warehouses.service';
import { ProductsService } from '../../../products/services/products.service';
import { Supplier } from '../../../../core/models/supplier.model';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { Product } from '../../../../core/models/product.model';

@Component({ selector: 'app-purchase-order-form', templateUrl: './purchase-order-form.component.html' })
export class PurchaseOrderFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  error: string | null = null;

  suppliers: Supplier[] = [];
  warehouses: Warehouse[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: PurchaseOrdersService,
    private suppliersSvc: SuppliersService,
    private warehousesSvc: WarehousesService,
    private productsSvc: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      supplierId: [null, Validators.required],
      warehouseId: [null, Validators.required],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitCost: [0, [Validators.required, Validators.min(0)]]
    });

    forkJoin({
      suppliers: this.suppliersSvc.getAll(),
      warehouses: this.warehousesSvc.getAll(),
      products: this.productsSvc.getAll(),
    }).subscribe({
      next: (results) => {
        this.suppliers = results.suppliers ?? [];
        this.warehouses = results.warehouses ?? [];
        this.products = results.products ?? [];
        this.loadingData = false;
      },
      error: () => {
        this.error = 'Failed to load form data';
        this.loadingData = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = {
      quantity: this.form.value.quantity,
      unitCost: this.form.value.unitCost,
      supplierId: this.form.value.supplierId,
      productId: this.form.value.productId,
      warehouseId: this.form.value.warehouseId
    };
    this.svc.create(payload).subscribe({
      next: () => this.router.navigate(['/purchase-orders']),
      error: (e) => {
        this.error = e?.message || 'Create failed';
        this.loading = false;
      }
    });
  }

  cancel() { this.router.navigate(['/purchase-orders']); }
}
