import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="showShell && (auth.currentUser$ | async) as user">
      <header class="app-header">
        <div class="brand">
          <span class="brand-mark">IM</span>
          <span>InventoryOS</span>
        </div>

        <nav class="app-nav" aria-label="Primary navigation">
          <a routerLink="/dashboard" routerLinkActive="active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            Dashboard
          </a>
          <a routerLink="/products" routerLinkActive="active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Products
          </a>
          <a routerLink="/warehouses" routerLinkActive="active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Warehouses
          </a>
          <a routerLink="/purchase-orders" routerLinkActive="active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-2px"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Purchase Orders
          </a>
        </nav>

        <div class="header-user">
          <span class="user-avatar">{{ getInitials(user.username) }}</span>
          <span class="user-name">{{ user.username }}</span>
          <span class="role-badge role-badge--{{ auth.getPrimaryRole().toLowerCase() }}">
            {{ auth.getPrimaryRole() }}
          </span>
        </div>

        <button class="logout-button" type="button" (click)="logout()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </header>
    </ng-container>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  showShell = false;

  constructor(public auth: AuthService, private router: Router) {
    this.showShell = this.shouldShowShell(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.showShell = this.shouldShowShell(event.urlAfterRedirects);
      });
  }

  logout(): void {
    this.auth.logout();
  }

  getInitials(username: string): string {
    if (!username) return 'U';
    const parts = username.split(/[\s._-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return username.substring(0, 2).toUpperCase();
  }

  private shouldShowShell(url: string): boolean {
    return !url.startsWith('/auth');
  }
}
