export interface PurchaseOrder {
  id: number;
  poNumber: string;
  quantity: number;
  unitCost: number;
  totalAmount?: number;
  status: string;
  supplierId: number;
  supplierName?: string;
  productId: number;
  productName?: string;
  warehouseId: number;
  warehouseName?: string;
  createdAt?: string;
  updatedAt?: string;
}
