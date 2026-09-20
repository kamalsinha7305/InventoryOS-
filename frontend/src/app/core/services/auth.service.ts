import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';
  private userKey = 'current_user';

  private _currentUser$ = new BehaviorSubject<AuthUser | null>(this.loadUser());
  public currentUser$ = this._currentUser$.asObservable();

  constructor(private api: ApiService, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.api.post<any>('/auth/login', { username, password }).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify({
            userId: res.userId,
            username: res.username,
            email: res.email,
            roles: res.roles
          }));
          this._currentUser$.next(this.loadUser());
        }
      })
    );
  }

  register(payload: { username: string; password: string; firstName: string; lastName: string; email: string; role?: string }): Observable<any> {
    return this.api.post<any>('/auth/register', payload).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify({
            userId: res.userId,
            username: res.username,
            email: res.email,
            roles: res.roles
          }));
          this._currentUser$.next(this.loadUser());
        }
      })
    );
  }

  logout(redirect: boolean = true) {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._currentUser$.next(null);
    if (redirect) {
      this.router.navigate(['/auth/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthUser | null {
    return this._currentUser$.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  // ── Role helpers ───────────────────────────────────────────────
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.hasRole(r));
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isManager(): boolean {
    return this.hasRole('Manager');
  }

  isExecutive(): boolean {
    return this.hasRole('Executive');
  }

  /** Admin or Manager can create / edit */
  canCreateOrEdit(): boolean {
    return this.hasAnyRole(['Admin', 'Manager']);
  }

  /** Only Admin can delete */
  canDelete(): boolean {
    return this.hasRole('Admin');
  }

  /** First role for display purposes */
  getPrimaryRole(): string {
    const user = this.getCurrentUser();
    return user?.roles?.[0] ?? '';
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch (e) {
      return null;
    }
  }
}
