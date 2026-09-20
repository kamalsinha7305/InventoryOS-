import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { PurchaseOrder } from '../../../../core/models/purchase-order.model';

@Component({ selector: 'app-purchase-order-detail', templateUrl: './purchase-order-detail.component.html' })
export class PurchaseOrderDetailComponent implements OnInit {
  order: PurchaseOrder | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private svc: PurchaseOrdersService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loading = true;
    this.svc.getById(Number(id)).subscribe({ next: (o) => { this.order = o; this.loading = false; }, error: () => { this.error = 'Failed to load'; this.loading = false; } });
  }

  back() { this.router.navigate(['/purchase-orders']); }
  approve() { if (!this.order) return; this.svc.approve(this.order.id).subscribe({ next: () => alert('Approved'), error: () => alert('Approve failed') }); }
}
