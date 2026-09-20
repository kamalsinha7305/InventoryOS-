import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehousesService } from '../../services/warehouses.service';
import { Warehouse } from '../../../../core/models/warehouse.model';

@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.css']
})
export class WarehouseDetailComponent implements OnInit {
  warehouse: Warehouse | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private svc: WarehousesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid warehouse ID';
      return;
    }
    this.loading = true;
    this.svc.getById(id).subscribe({
      next: (r) => {
        this.warehouse = r;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load warehouse details';
        this.loading = false;
      }
    });
  }

  getCapacityPct(): number {
    if (!this.warehouse || !this.warehouse.capacity) return 0;
    const cap = Number(this.warehouse.capacity);
    const avail = Number(this.warehouse.availableCapacity ?? cap);
    const used = Math.max(0, cap - avail);
    return Math.min(100, Math.round((used / cap) * 100));
  }

  getUsedCapacity(): number {
    if (!this.warehouse || !this.warehouse.capacity) return 0;
    const cap = Number(this.warehouse.capacity);
    const avail = Number(this.warehouse.availableCapacity ?? cap);
    return Math.max(0, cap - avail);
  }

  getCapStatusText(pct: number): string {
    if (pct >= 90) return 'Near Capacity';
    if (pct >= 70) return 'High Utilization';
    if (pct >= 40) return 'Optimal Capacity';
    return 'Ample Space Available';
  }

  getCapColor(pct: number): string {
    if (pct >= 90) return '#f43f5e';
    if (pct >= 70) return '#f59e0b';
    return '#10b981';
  }

  getDonutDash(score: number): string {
    const r = 45;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return `${dash} ${circ}`;
  }

  back() {
    this.router.navigate(['/warehouses']);
  }

  edit() {
    if (this.warehouse) {
      this.router.navigate(['/warehouses', this.warehouse.id, 'edit']);
    }
  }
}
