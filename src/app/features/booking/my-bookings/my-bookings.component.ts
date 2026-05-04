import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse } from '../../../core/models/booking.models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings  = signal<BookingResponse[]>([]);
  loading   = signal(true);
  error     = signal<string | null>(null);

  upcoming = computed(() =>
    this.bookings()
      .filter(b => b.status !== 'CANCELLED' && new Date(b.startTimeUtc) >= new Date())
      .sort((a, b) => new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime())
  );

  past = computed(() =>
    this.bookings()
      .filter(b => b.status === 'CANCELLED' || new Date(b.startTimeUtc) < new Date())
      .sort((a, b) => new Date(b.startTimeUtc).getTime() - new Date(a.startTimeUtc).getTime())
  );

  displayedColumns = ['date', 'status', 'notes'];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar seus agendamentos.');
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      weekday: 'long',
      day:     '2-digit',
      month:   'long',
      year:    'numeric',
      hour:    '2-digit',
      minute:  '2-digit'
    });
  }

  formatDateShort(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      CREATED:   'Aguardando',
      CONFIRMED: 'Confirmado',
      CANCELLED: 'Cancelado'
    };
    return map[status] ?? status;
  }

  statusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
