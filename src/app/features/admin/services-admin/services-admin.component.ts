import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ServiceOfferingService } from '../../../core/services/service-offering.service';
import { ServiceOffering } from '../../../core/models/service.models';

@Component({
  selector: 'app-services-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './services-admin.component.html',
  styleUrls: ['./services-admin.component.scss']
})
export class ServicesAdminComponent implements OnInit {
  services  = signal<ServiceOffering[]>([]);
  loading   = signal(true);
  error     = signal<string | null>(null);
  submitting = signal(false);
  showForm  = signal(false);

  form: FormGroup;

  displayedColumns = ['name', 'description', 'duration', 'price', 'active'];

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceOfferingService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name:            ['', [Validators.required, Validators.minLength(2)]],
      description:     ['', Validators.required],
      durationMinutes: [60, [Validators.required, Validators.min(5), Validators.max(480)]],
      price:           [0, [Validators.required, Validators.min(0)]],
      active:          [true]
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading.set(true);
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar serviços.');
        this.loading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.form.reset({ durationMinutes: 60, price: 0, active: true });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.serviceService.createService(this.form.value).subscribe({
      next: (newService) => {
        this.services.update(list => [...list, newService]);
        this.submitting.set(false);
        this.showForm.set(false);
        this.form.reset({ durationMinutes: 60, price: 0, active: true });
        this.snackBar.open('Serviço criado com sucesso!', 'OK', {
          duration: 3000, panelClass: 'snack-success'
        });
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err?.error?.message ?? 'Erro ao criar serviço.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
