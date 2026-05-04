import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServiceOfferingService } from '../../../core/services/service-offering.service';
import { ProfessionalService } from '../../../core/services/professional.service';
import { BookingService } from '../../../core/services/booking.service';
import { ServiceOffering } from '../../../core/models/service.models';
import { Professional } from '../../../core/models/professional.models';

@Component({
  selector: 'app-new-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.scss']
})
export class NewBookingComponent implements OnInit {
  // Stepper forms
  serviceForm: FormGroup;
  professionalForm: FormGroup;
  dateTimeForm: FormGroup;
  notesForm: FormGroup;

  // Data
  services      = signal<ServiceOffering[]>([]);
  professionals = signal<Professional[]>([]);

  selectedService      = signal<ServiceOffering | null>(null);
  selectedProfessional = signal<Professional | null>(null);

  // Loading states
  loadingSvc  = signal(true);
  loadingPros = signal(true);
  submitting  = signal(false);

  // Time slots
  readonly timeSlots = this.generateTimeSlots();

  // Min date for datepicker
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceOfferingService,
    private professionalService: ProfessionalService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.serviceForm = this.fb.group({
      serviceId: ['', Validators.required]
    });

    this.professionalForm = this.fb.group({
      professionalId: ['', Validators.required]
    });

    this.dateTimeForm = this.fb.group({
      date:     [null, Validators.required],
      timeSlot: ['', Validators.required]
    });

    this.notesForm = this.fb.group({
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.loadProfessionals();
  }

  private loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services.set(data.filter(s => s.active));
        this.loadingSvc.set(false);
      },
      error: () => {
        this.loadingSvc.set(false);
        this.snackBar.open('Erro ao carregar serviços', 'Fechar', { duration: 4000 });
      }
    });
  }

  private loadProfessionals(): void {
    this.professionalService.getProfessionals().subscribe({
      next: (data) => {
        this.professionals.set(data.filter(p => p.active));
        this.loadingPros.set(false);
      },
      error: () => {
        this.loadingPros.set(false);
        this.snackBar.open('Erro ao carregar profissionais', 'Fechar', { duration: 4000 });
      }
    });
  }

  selectService(service: ServiceOffering): void {
    this.selectedService.set(service);
    this.serviceForm.patchValue({ serviceId: service.id });
  }

  selectProfessional(professional: Professional): void {
    this.selectedProfessional.set(professional);
    this.professionalForm.patchValue({ professionalId: professional.id });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid || this.professionalForm.invalid || this.dateTimeForm.invalid) {
      return;
    }

    const { date, timeSlot } = this.dateTimeForm.value;
    const [hours, minutes] = timeSlot.split(':').map(Number);

    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);

    this.submitting.set(true);

    this.bookingService.createBooking({
      serviceId:      this.serviceForm.value.serviceId,
      professionalId: this.professionalForm.value.professionalId,
      startTime:      startTime.toISOString(),
      notes:          this.notesForm.value.notes || undefined
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Agendamento criado com sucesso!', 'OK', {
          duration: 4000,
          panelClass: 'snack-success'
        });
        this.router.navigate(['/bookings/my']);
      },
      error: (err) => {
        this.submitting.set(false);
        const msg = err?.error?.message ?? 'Erro ao criar agendamento.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000, panelClass: 'snack-error' });
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let h = 8; h <= 19; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 19) slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    return slots;
  }
}
