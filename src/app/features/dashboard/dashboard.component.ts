import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingResponse } from '../../core/models/booking.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private authService    = inject(AuthService);
  private bookingService = inject(BookingService);

  currentUser = this.authService.currentUser;
  isAdmin     = this.authService.isAdmin;

  firstName = computed(() => {
    const name = this.currentUser()?.fullName ?? '';
    return name.split(' ')[0];
  });

  bookings      = signal<BookingResponse[]>([]);
  loadingBkgs   = signal(true);
  bookingError  = signal<string | null>(null);

  upcomingBookings = computed(() =>
    this.bookings()
      .filter(b => b.status !== 'CANCELLED')
      .sort((a, b) => new Date(a.startTimeUtc).getTime() - new Date(b.startTimeUtc).getTime())
      .slice(0, 5)
  );

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loadingBkgs.set(true);
    this.bookingError.set(null);

    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loadingBkgs.set(false);
      },
      error: () => {
        this.bookingError.set('Não foi possível carregar os agendamentos.');
        this.loadingBkgs.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
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
