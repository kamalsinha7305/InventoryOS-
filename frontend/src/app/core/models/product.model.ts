export interface Product {
  id: number;
  name: string;
  sku?: string;
  unitPrice: number; // maps to backend unitPrice
  reorderLevel?: number;
  currentStock: number; // maps to backend currentStock
  status?: string;
  categoryId?: number;
  categoryName?: string;
  supplierId?: number;
  supplierName?: string;
  createdAt?: string;
  updatedAt?: string;
}
