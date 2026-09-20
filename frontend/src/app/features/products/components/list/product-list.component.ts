import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  loading = false;
  error: string | null = null;

  constructor(
    private svc: ProductsService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load products';
        this.loading = false;
      }
    });
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }
    const q = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
      (p.supplierName && p.supplierName.toLowerCase().includes(q))
    );
  }

  isLowStock(p: Product): boolean {
    if (p.reorderLevel == null) return false;
    return Number(p.currentStock ?? 0) <= Number(p.reorderLevel);
  }

  view(p: Product) {
    this.router.navigate(['/products', p.id]);
  }
  edit(p: Product) {
    this.router.navigate(['/products', p.id, 'edit']);
  }
  create() {
    this.router.navigate(['/products', 'create']);
  }

  delete(p: Product) {
    if (!confirm(`Are you sure you want to delete "${p.name}"?`)) return;
    this.svc.delete(p.id).subscribe({
      next: () => this.load(),
      error: (e) =>
        alert(
          e?.error?.message ||
            (e instanceof Error ? e.message : 'Delete failed')
        )
    });
  }
}
