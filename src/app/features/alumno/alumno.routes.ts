import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard'; // EL MARCO (Sidebar)

export const ALUMNO_ROUTES: Routes = [
  {
    path: '',
    component: Dashboard, // 1. El componente que tiene el Aside/Sidebar
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/main-alumno/main-alumno').then(c => c.MainAlumno) 
      },
      { 
        path: 'ofertas', 
        loadComponent: () => import('./pages/ofertas/ofertas').then(c => c.Ofertas) 
      },
      { 
        path: 'perfil', 
        loadComponent: () => import('./pages/perfil/perfil').then(c => c.Perfil) 
      },
        { 
        path: 'candidaturas', 
        loadComponent: () => import('./pages/mis-candidaturas/mis-candidaturas').then(c => c.MisCandidaturas) 
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];