import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";
import { inject } from "@angular/core";

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el ID que esta guardado en el servicio authService
  const userId = authService.currentUserId;

  if (userId === 1) {
    return true; // Es el SuperAdmin, adelante
  }

  console.warn('🚫 Intento de acceso a STAFF por ID:', userId);
  return router.createUrlTree(['/admin/main']); // Redirigir al panel normal
};