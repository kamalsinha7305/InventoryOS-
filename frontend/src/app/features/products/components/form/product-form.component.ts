import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { SuppliersService } from '../../services/suppliers.service';
import { Category } from '../../../../core/models/category.model';
import { Supplier } from '../../../../core/models/supplier.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  loadingData = true;
  error: string | null = null;
  editing = false;
  id: number | null = null;

  categories: Category[] = [];
  suppliers: Supplier[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: ProductsService,
    private categoriesSvc: CategoriesService,
    private suppliersSvc: SuppliersService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [0, [Validators.required, Validators.min(0)]],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      status: ['ACTIVE', Validators.required],
      categoryId: [null, Validators.required],
      supplierId: [null, Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
    }

    // Load categories, suppliers and (if editing) the product in parallel
    const requests: any = {
      categories: this.categoriesSvc.getAll(),
      suppliers: this.suppliersSvc.getAll(),
    };
    if (this.editing && this.id) {
      requests['product'] = this.svc.getById(this.id);
    }

    forkJoin(requests).subscribe({
      next: (results: any) => {
        this.categories = results['categories'] ?? [];
        this.suppliers = results['suppliers'] ?? [];
        if (results['product']) {
          const p = results['product'];
          this.form.patchValue({
            name: p.name,
            unitPrice: p.unitPrice,
            reorderLevel: p.reorderLevel,
            currentStock: p.currentStock,
            status: p.status,
            categoryId: p.categoryId,
            supplierId: p.supplierId,
          });
        }
        this.loadingData = false;
      },
      error: () => {
        this.error = 'Failed to load form data';
        this.loadingData = false;
      },
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value;
    if (this.editing && this.id) {
      this.svc.update(this.id, payload).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (e) => {
          const status = e?.status ?? e?.raw?.status ?? 0;
          const msg = e?.message || (e?.raw?.message ?? 'Save failed');
          if (status === 0) {
            this.error = 'Cannot reach API server. Is the backend running?';
          } else if (status === 401 || status === 403) {
            this.error = 'Unauthorized. Please login.';
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: `/products/${this.id}/edit` },
            });
          } else {
            this.error = msg;
          }
          this.loading = false;
        },
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (e) => {
          const status = e?.status ?? e?.raw?.status ?? 0;
          const msg = e?.message || (e?.raw?.message ?? 'Create failed');
          if (status === 0) {
            this.error = 'Cannot reach API server. Is the backend running?';
          } else if (status === 401 || status === 403) {
            this.error = 'Unauthorized. Please login.';
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: '/products/create' },
            });
          } else {
            this.error = msg;
          }
          this.loading = false;
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
