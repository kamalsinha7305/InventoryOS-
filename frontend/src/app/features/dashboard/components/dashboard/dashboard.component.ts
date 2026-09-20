import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardKPI } from '../../../../core/models/dashboard.model';

export interface WarehouseChart {
  name: string;
  used: number;
  capacity: number;
  pct: number;
  color: string;
}

export interface MonthlyTrendPoint {
  month: string;
  value: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  kpi: DashboardKPI | null = null;
  loading = false;
  error: string | null = null;

  warehouseCharts: WarehouseChart[] = [];
  rawWarehouses: any[] = [];
  rawProducts: any[] = [];

  // Top Products Stock Level Chart
  topProducts: { name: string; stock: number; maxStock: number }[] = [];

  // Monthly Stock Valuation Trend Points
  trendPoints: MonthlyTrendPoint[] = [];
  areaPathD = '';
  linePathD = '';

  readonly CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4'];

  constructor(private svc: DashboardService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.svc.getKpisWithData().subscribe({
      next: ({ kpi, warehouses, products }) => {
        this.kpi = kpi;
        this.rawWarehouses = warehouses;
        this.rawProducts = products;
        this.buildWarehouseCharts(warehouses);
        this.buildTopProducts(products);
        this.buildTrendGraph(kpi.totalStockValue);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }

  private buildWarehouseCharts(warehouses: any[]): void {
    this.warehouseCharts = warehouses
      .filter(w => w.capacity && Number(w.capacity) > 0)
      .slice(0, 6)
      .map((w, i) => {
        const cap = Number(w.capacity ?? 0);
        const avail = Number(w.availableCapacity ?? cap);
        const used = Math.max(0, cap - avail);
        const pct = cap > 0 ? Math.round((used / cap) * 100) : 0;
        return {
          name: w.name,
          used,
          capacity: cap,
          pct,
          color: this.CHART_COLORS[i % this.CHART_COLORS.length]
        };
      });
  }

  private buildTopProducts(products: any[]): void {
    const sorted = [...products]
      .filter(p => p.currentStock != null)
      .sort((a, b) => Number(b.currentStock) - Number(a.currentStock))
      .slice(0, 6);
    const maxStock = sorted.length ? Number(sorted[0].currentStock) : 1;
    this.topProducts = sorted.map(p => ({
      name: p.name || p.sku || 'Unknown',
      stock: Number(p.currentStock),
      maxStock: Math.max(maxStock, 1)
    }));
  }

  private buildTrendGraph(currentValue: number): void {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const multipliers = [0.65, 0.72, 0.78, 0.85, 0.92, 1.0];
    const width = 700;
    const height = 180;
    const paddingX = 40;
    const paddingY = 30;

    const baseVal = currentValue > 0 ? currentValue : 50000;
    const values = multipliers.map(m => Math.round(baseVal * m));
    const minV = Math.min(...values) * 0.9;
    const maxV = Math.max(...values) * 1.05;

    const stepX = (width - paddingX * 2) / (months.length - 1);

    this.trendPoints = months.map((m, i) => {
      const x = paddingX + i * stepX;
      const normY = (values[i] - minV) / (maxV - minV || 1);
      const y = height - paddingY - normY * (height - paddingY * 2);
      return { month: m, value: values[i], x, y };
    });

    if (this.trendPoints.length > 0) {
      let path = `M ${this.trendPoints[0].x},${this.trendPoints[0].y}`;
      for (let i = 1; i < this.trendPoints.length; i++) {
        const prev = this.trendPoints[i - 1];
        const curr = this.trendPoints[i];
        const cX = (prev.x + curr.x) / 2;
        path += ` C ${cX},${prev.y} ${cX},${curr.y} ${curr.x},${curr.y}`;
      }
      this.linePathD = path;
      const last = this.trendPoints[this.trendPoints.length - 1];
      const first = this.trendPoints[0];
      this.areaPathD = `${path} L ${last.x},${height} L ${first.x},${height} Z`;
    }
  }

  getCapColor(pct: number): string {
    if (pct >= 90) return '#f43f5e';
    if (pct >= 70) return '#f59e0b';
    return '#10b981';
  }

  getHealthColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#f43f5e';
  }

  getHealthLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  }

  getDonutDash(score: number): string {
    const r = 40;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return `${dash} ${circ}`;
  }
}
