import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

/**
 * Structural directive that shows or hides elements based on user roles.
 *
 * Usage:
 *   <button *appHasRole="['Admin','Manager']">Edit</button>
 */
@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {
  private roles: string[] = [];

  @Input()
  set appHasRole(roles: string[]) {
    this.roles = roles;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.auth.hasAnyRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
