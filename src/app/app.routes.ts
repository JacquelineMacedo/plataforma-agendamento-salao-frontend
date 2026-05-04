import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [
      () => {
        const auth   = inject(AuthService);
        const router = inject(Router);
        return router.createUrlTree(auth.isLoggedIn() ? ['/dashboard'] : ['/login']);
      }
    ],
    // Dummy component - canActivate always redirects
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'bookings/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/booking/new-booking/new-booking.component').then(m => m.NewBookingComponent)
  },
  {
    path: 'bookings/my',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/booking/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent)
  },
  {
    path: 'admin/services',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/services-admin/services-admin.component').then(m => m.ServicesAdminComponent)
  },
  {
    path: 'admin/professionals',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/professionals-admin/professionals-admin.component').then(m => m.ProfessionalsAdminComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
