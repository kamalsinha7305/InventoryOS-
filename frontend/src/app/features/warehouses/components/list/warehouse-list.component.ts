import { Component, OnInit } from '@angular/core';
import { WarehousesService } from '../../services/warehouses.service';
import { Warehouse } from '../../../../core/models/warehouse.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent implements OnInit {
  warehouses: Warehouse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private svc: WarehousesService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (r) => {
        this.warehouses = r;
        this.loading = false;
      },
      error: (e) => {
        this.error = 'Failed to load warehouses';
        this.loading = false;
      }
    });
  }

  getCapacityPct(w: Warehouse): number {
    const cap = Number(w.capacity ?? 0);
    if (!cap) return 0;
    const avail = Number(w.availableCapacity ?? cap);
    const used = Math.max(0, cap - avail);
    return Math.min(100, Math.round((used / cap) * 100));
  }

  getUsedCapacity(w: Warehouse): number {
    const cap = Number(w.capacity ?? 0);
    const avail = Number(w.availableCapacity ?? cap);
    return Math.max(0, cap - avail);
  }

  getCapColorClass(pct: number): string {
    if (pct >= 90) return 'red';
    if (pct >= 70) return 'amber';
    return 'green';
  }

  view(w: Warehouse) {
    this.router.navigate(['/warehouses', w.id]);
  }

  edit(w: Warehouse) {
    this.router.navigate(['/warehouses', w.id, 'edit']);
  }

  create() {
    this.router.navigate(['/warehouses', 'create']);
  }

  delete(w: Warehouse) {
    if (!confirm(`Are you sure you want to delete "${w.name}"?`)) return;
    this.svc.delete(w.id).subscribe({
      next: () => this.load(),
      error: (e) =>
        alert(
          e?.error?.message ||
            (e instanceof Error ? e.message : 'Delete failed')
        )
    });
  }
}
