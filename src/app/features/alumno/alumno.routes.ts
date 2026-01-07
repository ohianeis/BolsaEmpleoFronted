import { Routes } from '@angular/router';

export const ALUMNO_ROUTES: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'ofertas', 
        // Usamos loadComponent para Lazy Loading (lo más actual)
        loadComponent: () => import('./pages/ofertas/ofertas').then(c => c.Ofertas) 
      },
          { 
        path: 'dashboard', 
        // Usamos loadComponent para Lazy Loading (lo más actual)
        loadComponent: () => import('./pages/dashboard/dashboard').then(c => c.Dashboard) 
      },
      { 
        path: 'perfil', 
        loadComponent: () => import('./pages/perfil/perfil').then(c => c.Perfil) 
      },
      { 
        path: '', redirectTo: 'dashboard', pathMatch: 'full' 
      }
    ]
  }
];