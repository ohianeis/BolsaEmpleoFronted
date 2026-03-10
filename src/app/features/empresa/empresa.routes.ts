import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard'; // Importa el componente del sidebar
import { Ayuda } from '../Shared/pages/ayuda/ayuda';

export const EMPRESA_ROUTES: Routes = [
  {
    path: '',
    component: Dashboard, // 1. Este es el que tiene el Sidebar (EL MARCO)
    children: [
      { 
        path: 'dashboard', 
        // 2. Aquí carga un componente que SOLO tenga el contenido, NO el menú
        loadComponent: () => import('./pages/main-empresa/main-empresa').then(c => c.MainEmpresa) 
      },
      { 
        path: 'mis-ofertas', 
        loadComponent: () => import('./pages/mis-ofertas/mis-ofertas').then(c => c.MisOfertas) 
      },
           { 
        path: 'nueva-oferta', 
        loadComponent: () => import('./pages/nueva-oferta/nueva-oferta').then(c => c.NuevaOferta) 
      },
      { 
 path: 'editar-oferta/:id', 
        loadComponent: () => import('./pages/nuevaOferta/editar-oferta/editar-oferta').then(c => c.EditarOferta)
  },
      { path: 'ayuda', component: Ayuda, data: { role: 'empresa' } },
      // empresa.routes.ts
{ 
  path: 'oferta/:id', 
  loadComponent: () => import('./pages/detalle-oferta/detalle-oferta').then(m => m.DetalleOferta) 
},
{ 
        path: 'perfil', 
        loadComponent: () => import('./pages/perfil-empresa/perfil-empresa').then(c => c.PerfilEmpresa) 
      },
      // ... resto de rutas
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
    ]
  }
];