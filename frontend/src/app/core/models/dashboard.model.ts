export interface DashboardKPI {
  totalProducts: number;
  totalStockValue: number; // sum of (quantityOnHand * cost)
  lowStockCount: number;
  pendingPurchaseOrders: number;
  healthScore: number; // 0-100
  lastUpdated?: string;
}
