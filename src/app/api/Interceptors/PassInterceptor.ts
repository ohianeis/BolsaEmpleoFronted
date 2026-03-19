import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const PassInterceptor: HttpInterceptorFn = (req, next) => {
  // En las funciones usamos 'inject' en lugar de constructor
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Si el servidor nos dice que la contraseña debe ser cambiada (403)
      if (error.status === 403 && error.error?.mensaje === 'DEBES_CAMBIAR_PASSWORD') {
        
        console.warn('Redirigiendo: Cambio de contraseña obligatorio detectado.');
        
        router.navigate(['/auth/cambiar-password'], {
          queryParams: { forced: true }
        });
      }

      return throwError(() => error);
    })
  );
};