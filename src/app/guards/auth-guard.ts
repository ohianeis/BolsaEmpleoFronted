import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];

  console.log('--- 🛡️ GUARD CHECK ---');
  console.log('Ruta destino:', state.url);
  console.log('Rol que pide la ruta (Data):', expectedRole);

  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('❌ No hay token en el navegador');
    return router.createUrlTree(['/login']);
  }

  return authService.getRolActual().pipe(
    map((rol) => {
      console.log('👤 Rol obtenido del Servicio:', `"${rol}"`);
      const mustChange = sessionStorage.getItem('change_pass') === '1';
      if (mustChange && state.url !== '/auth/cambiar-password') {
        console.warn('🔐 Bloqueo por Reset Password activo');
        return router.createUrlTree(['/auth/cambiar-password']);
      }
      // 1. Caso Error o Sesión caducada
      if (!rol || rol === 'invalido') {
        console.error('🚫 Rol no válido, enviando a login');
        return router.createUrlTree(['/login']);
      }

      // Caso Éxito (Si entra aquí, el Guard devuelve TRUE y no hay redirección)
      if (rol === expectedRole) {
        console.log('✅ COINCIDENCIA: Acceso permitido');
        return true;
      }

      // Caso Conflicto de Roles (redirección)
      console.warn(`⚠️ CONFLICTO: El usuario es "${rol}" pero la ruta pide "${expectedRole}"`);

      switch (rol) {
        case 'alumno':
          console.log('🚀 Redirigiendo a zona ALUMNO');
          return router.createUrlTree(['/alumno/dashboard']);
        case 'empresa':
          console.log('🚀 Redirigiendo a zona EMPRESA');
          return router.createUrlTree(['/empresa/dashboard']);
        case 'admin':
          console.log('🚀 Redirigiendo a zona ADMIN');
          return router.createUrlTree(['/admin/main']);
        default:
          console.error('❓ Rol desconocido en el switch, enviando a login');
          return router.createUrlTree(['/login']);
      }
    }),
  );
};
