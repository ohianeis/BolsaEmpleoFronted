import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard').then(c => c.Dashboard) 
      },
      { 
        path: 'usuarios', 
        loadComponent: () => import('./pages/gestionUsuarios/usuarios/usuarios').then(c => c.Usuarios) 
      },
      { 
        path: 'configuracion', 
        loadComponent: () => import('./pages/config/config/config').then(c => c.Config) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];