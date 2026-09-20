import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private svc: ProductsService, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid id'; return; }
    this.loading = true;
    this.svc.getById(id).subscribe({ next: (p) => { this.product = p; this.loading = false; }, error: (e) => { this.error = 'Failed to load'; this.loading = false; } });
  }

  back() { this.router.navigate(['/products']); }
  edit() { if (this.product) this.router.navigate(['/products', this.product.id, 'edit']); }
}
