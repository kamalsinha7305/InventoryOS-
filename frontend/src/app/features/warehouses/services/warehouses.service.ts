import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Warehouse } from '../../../core/models/warehouse.model';

@Injectable({ providedIn: 'root' })
export class WarehousesService {
  private base = '/v1/warehouses';
  constructor(private api: ApiService) {}

  getAll(): Observable<Warehouse[]> { return this.api.get<Warehouse[]>(this.base); }
  getById(id: number): Observable<Warehouse> { return this.api.get<Warehouse>(`${this.base}/${id}`); }
  create(payload: any) { return this.api.post<Warehouse>(this.base, payload); }
  update(id: number, payload: any) { return this.api.put<Warehouse>(`${this.base}/${id}`, payload); }
  delete(id: number) { return this.api.delete<void>(`${this.base}/${id}`); }
}
