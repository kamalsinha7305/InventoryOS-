import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { DashboardKPI } from '../../../core/models/dashboard.model';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getKpisWithData(): Observable<{ kpi: DashboardKPI; warehouses: any[]; products: any[] }> {
    const products$ = this.api.get<any[]>('/v1/products');
    const pos$ = this.api.get<any[]>('/v1/purchase-orders');
    const warehouses$ = this.api.get<any[]>('/v1/warehouses');

    return forkJoin({ products: products$, pos: pos$, warehouses: warehouses$ }).pipe(
      map(({ products, pos, warehouses }) => {
        const totalProducts = products?.length ?? 0;

        const totalStockValue = (products ?? []).reduce((acc, p) => {
          const qty = Number(p.currentStock ?? 0);
          const unit = Number(p.unitPrice ?? 0);
          return acc + qty * unit;
        }, 0);

        const lowStockCount = (products ?? []).filter(
          p => p.reorderLevel != null && Number(p.currentStock ?? 0) <= Number(p.reorderLevel)
        ).length;

        const pendingPurchaseOrders = (pos ?? []).filter(
          po => po.status === 'PENDING' || po.status === 'CREATED'
        ).length;

        const lowStockRatio = totalProducts ? lowStockCount / totalProducts : 0;
        const expectedPOThreshold = 10;
        const pendingPoRatio = pendingPurchaseOrders / Math.max(1, expectedPOThreshold);
        const w1 = 0.75, w2 = 0.25;
        const rawScore = 100 * (w1 * (1 - lowStockRatio) + w2 * (1 - pendingPoRatio));
        const healthScore = Math.max(0, Math.min(100, Math.round(rawScore)));

        const kpi: DashboardKPI = {
          totalProducts,
          totalStockValue,
          lowStockCount,
          pendingPurchaseOrders,
          healthScore,
          lastUpdated: new Date().toISOString()
        };

        return { kpi, warehouses: warehouses ?? [], products: products ?? [] };
      })
    );
  }

  // Keep old method for backward compat
  getKpis(): Observable<DashboardKPI> {
    return this.getKpisWithData().pipe(map(d => d.kpi));
  }
}
