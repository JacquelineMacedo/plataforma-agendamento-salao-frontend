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

import { ProfessionalService } from '../../../core/services/professional.service';
import { Professional } from '../../../core/models/professional.models';

@Component({
  selector: 'app-professionals-admin',
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
    MatDividerModule
  ],
  templateUrl: './professionals-admin.component.html',
  styleUrls: ['./professionals-admin.component.scss']
})
export class ProfessionalsAdminComponent implements OnInit {
  professionals = signal<Professional[]>([]);
  loading       = signal(true);
  error         = signal<string | null>(null);
  submitting    = signal(false);
  showForm      = signal(false);

  form: FormGroup;

  displayedColumns = ['avatar', 'fullName', 'email', 'active'];

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      active:   [true]
    });
  }

  ngOnInit(): void {
    this.loadProfessionals();
  }

  loadProfessionals(): void {
    this.loading.set(true);
    this.professionalService.getProfessionals().subscribe({
      next: (data) => {
        this.professionals.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar profissionais.');
        this.loading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) this.form.reset({ active: true });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.professionalService.createProfessional(this.form.value).subscribe({
      next: (newPro) => {
        this.professionals.update(list => [...list, newPro]);
        this.submitting.set(false);
        this.showForm.set(false);
        this.form.reset({ active: true });
        this.snackBar.open('Profissional cadastrado com sucesso!', 'OK', {
          duration: 3000, panelClass: 'snack-success'
        });
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err?.error?.message ?? 'Erro ao cadastrar profissional.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000 });
      }
    });
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map(n => n.charAt(0).toUpperCase())
      .join('');
  }
}
