import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, map } from 'rxjs';
import { Product } from '../../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private base = '/v1/products';
  constructor(private api: ApiService) {}

  getAll(): Observable<Product[]> { return this.api.get<any[]>(this.base).pipe(map(arr => (arr || []).map(this.mapResponseToProduct)) ); }
  getById(id: number): Observable<Product> { return this.api.get<any>(`${this.base}/${id}`).pipe(map(this.mapResponseToProduct)); }
  create(payload: any) { return this.api.post<any>(this.base, payload).pipe(map(this.mapResponseToProduct)); }
  update(id: number, payload: any) { return this.api.put<any>(`${this.base}/${id}`, payload).pipe(map(this.mapResponseToProduct)); }
  delete(id: number) { return this.api.delete<void>(`${this.base}/${id}`); }

  private mapResponseToProduct(resp: any): Product {
    if (!resp) return resp;
    return {
      id: resp.id,
      name: resp.name,
      sku: resp.sku,
      unitPrice: Number(resp.unitPrice ?? 0),
      reorderLevel: resp.reorderLevel,
      currentStock: resp.currentStock ?? 0,
      status: resp.status,
      categoryId: resp.categoryId,
      categoryName: resp.categoryName,
      supplierId: resp.supplierId,
      supplierName: resp.supplierName,
      createdAt: resp.createdAt,
      updatedAt: resp.updatedAt
    } as Product;
  }
}
