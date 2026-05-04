import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="showNavbar()" />
    <main [class.with-navbar]="showNavbar()">
      <router-outlet />
    </main>
  `,
  styles: [`
    main.with-navbar {
      padding-top: 64px;
      min-height: calc(100vh - 64px);
    }
    main {
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  private authService = inject(AuthService);
  showNavbar = computed(() => this.authService.isLoggedIn());
}
