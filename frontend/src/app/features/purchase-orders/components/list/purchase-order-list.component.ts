import { Component, OnInit } from '@angular/core';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { Router } from '@angular/router';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({ selector: 'app-purchase-order-list', templateUrl: './purchase-order-list.component.html' })
export class PurchaseOrderListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private svc: PurchaseOrdersService,
    private router: Router,
    public auth: AuthService,
  ) {}

  ngOnInit(): void { this.load(); }
  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (r) => { this.orders = r; this.loading = false; },
      error: () => { this.error = 'Failed to load'; this.loading = false; }
    });
  }
  view(o: PurchaseOrder) { this.router.navigate(['/purchase-orders', o.id]); }
  create() { this.router.navigate(['/purchase-orders', 'create']); }
  approve(o: PurchaseOrder) {
    if (!confirm('Approve this PO?')) return;
    this.svc.approve(o.id).subscribe({ next: () => this.load(), error: () => alert('Approve failed') });
  }
  delete(o: PurchaseOrder) {
    if (!confirm('Delete PO?')) return;
    this.svc.delete(o.id).subscribe({ next: () => this.load(), error: () => alert('Delete failed') });
  }
}
