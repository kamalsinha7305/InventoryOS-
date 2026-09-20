import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Category } from '../../../core/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private base = '/v1/categories';

  constructor(private api: ApiService) {}

  getAll(): Observable<Category[]> {
    return this.api.get<Category[]>(this.base);
  }
}
