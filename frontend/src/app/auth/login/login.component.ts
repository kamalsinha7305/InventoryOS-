import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error: string | null = null;
  returnUrl: string | null = null;
  selectedDemoRole: string | null = null;

  demoUsers = [
    { role: 'Admin', username: 'admin', password: 'admin123', badgeClass: 'role-badge--admin', icon: '🛡️' },
    { role: 'Manager', username: 'manager', password: 'manager123', badgeClass: 'role-badge--manager', icon: '💼' },
    { role: 'Executive', username: 'executive', password: 'executive123', badgeClass: 'role-badge--executive', icon: '👁️' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  /** Fills the credentials into form fields without auto-submitting immediately */
  fillDemoCredentials(user: { role: string; username: string; password: string }): void {
    this.selectedDemoRole = user.role;
    this.error = null;
    this.loginForm.patchValue({
      username: user.username,
      password: user.password
    });
  }

  submit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;

    const { username, password } = this.loginForm.value;
    this.auth.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl || '/dashboard');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Invalid username or password';
      }
    });
  }
}
