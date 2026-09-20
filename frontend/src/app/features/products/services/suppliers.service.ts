import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Supplier } from '../../../core/models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private base = '/v1/suppliers';

  constructor(private api: ApiService) {}

  getAll(): Observable<Supplier[]> {
    return this.api.get<Supplier[]>(this.base);
  }
}
