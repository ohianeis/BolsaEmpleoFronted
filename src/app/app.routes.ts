import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { Ayuda } from './features/Shared/pages/ayuda/ayuda';
import { Register } from './features/auth/pages/register/register';
import { authGuard } from './guards/auth-guard';
import { ChangePass } from './features/auth/pages/change-pass/change-pass';
// Aquí importarás los Guards más adelante

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: Register },
  { path: 'auth/cambiar-password', component: ChangePass },
  // app.routes.ts o tus archivos de rutas específicos

  // Rutas de ALUMNO
  {
    path: 'alumno',
    canActivate: [authGuard],
    data: { role: 'alumno' },
    loadChildren: () => import('./features/alumno/alumno.routes').then((m) => m.ALUMNO_ROUTES),
    // canActivate: [AuthGuard, RoleGuard], data: { role: 'alumno' }
  },

  // Rutas de EMPRESA
  {
    path: 'empresa',
    canActivate: [authGuard],
    data: { role: 'empresa' },
    loadChildren: () => import('./features/empresa/empresa.routes').then((m) => m.EMPRESA_ROUTES),
    // canActivate: [AuthGuard, RoleGuard], data: { role: 'empresa' }
  },

  // Rutas de ADMIN
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'administrador' },
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    // canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' }
  },

  // Ruta para errores 404 (opcional)
  { path: '**', redirectTo: 'login' },
];
