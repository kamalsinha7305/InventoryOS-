import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error: string | null = null;

  roles = [
    { value: 'Manager', label: 'Manager', icon: '💼', desc: 'Create & Edit Access' },
    { value: 'Admin', label: 'Admin', icon: '🛡️', desc: 'Full System & Delete Access' },
    { value: 'Executive', label: 'Executive', icon: '👁️', desc: 'Read-Only Analytics' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Manager', Validators.required]
    });

    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  selectRole(roleValue: string): void {
    this.registerForm.patchValue({ role: roleValue });
  }

  submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      const emailCtrl = this.registerForm.get('email');
      if (emailCtrl && emailCtrl.invalid) {
        this.error = 'Please enter a valid email address (e.g. alex@company.com)';
      } else {
        this.error = 'Please fill in all required fields.';
      }
      return;
    }

    this.loading = true;
    this.error = null;

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Registration failed. Please check your inputs.';
      }
    });
  }
}
