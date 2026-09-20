import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WarehousesService } from "../../services/warehouses.service";

@Component({
  selector: "app-warehouse-form",
  templateUrl: "./warehouse-form.component.html",
})
export class WarehouseFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  editing = false;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: WarehousesService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", Validators.required],
      location: ["", Validators.required],
      capacity: [0, [Validators.required, Validators.min(0)]],
      availableCapacity: [0, [Validators.required, Validators.min(0)]],
      status: ["ACTIVE", Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.loading = true;
      this.svc.getById(this.id).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.loading = false;
        },
        error: () => {
          this.error = "Failed to load";
          this.loading = false;
        },
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = {
      ...this.form.value,
      availableCapacity:
        this.form.value.availableCapacity ?? this.form.value.capacity,
    };
    if (this.editing && this.id) {
      this.svc.update(this.id, payload).subscribe({
        next: () => this.router.navigate(["/warehouses"]),
        error: (e) => {
          this.error =
            e?.message || (e instanceof Error ? e.message : "Save failed");
          this.loading = false;
        },
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => this.router.navigate(["/warehouses"]),
        error: (e) => {
          this.error =
            e?.message || (e instanceof Error ? e.message : "Create failed");
          this.loading = false;
        },
      });
    }
  }

  cancel() {
    this.router.navigate(["/warehouses"]);
  }
}
