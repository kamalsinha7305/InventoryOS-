import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../../../core/models/purchase-order.model';

@Injectable({ providedIn: 'root' })
export class PurchaseOrdersService {
  private base = '/v1/purchase-orders';
  constructor(private api: ApiService) {}

  getAll(): Observable<PurchaseOrder[]> { return this.api.get<PurchaseOrder[]>(this.base); }
  getById(id: number): Observable<PurchaseOrder> { return this.api.get<PurchaseOrder>(`${this.base}/${id}`); }
  create(payload: any) { return this.api.post<PurchaseOrder>(this.base, payload); }
  approve(id: number) { return this.api.post<PurchaseOrder>(`${this.base}/${id}/approve`, {}); }
  delete(id: number) { return this.api.delete<void>(`${this.base}/${id}`); }
}
