import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-log-out',
  imports: [ButtonModule],
  templateUrl: './log-out.html',
  styleUrl: './log-out.css',
})
export class LogOut {
private authService = inject(AuthService);
  private router = inject(Router);

  ejecutarLogout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']) // Siempre redirige
    });
  }
}
