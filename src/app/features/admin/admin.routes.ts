import { Administradores } from './pages/gestionAdministradores/administradores/administradores';
import { Validaciones } from './pages/gestionValidaciones/validaciones/validaciones';


import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { adminGuard } from '../../guards/admin-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component:Dashboard,
    children: [
   
         { 
        path: 'main', 
        loadComponent: () => import('./pages/main/main').then(c => c.Main) 
      },
      { 
        path: 'usuarios', 
        loadComponent: () => import('./pages/gestionUsuarios/usuarios/usuarios').then(c => c.Usuarios) 
      },
      { 
        path: 'configuracion', 
        loadComponent: () => import('./pages/config/config/config').then(c => c.Config) 
      },
      { 
  path: 'validaciones', 
  loadComponent: () => import('./pages/gestionValidaciones/validaciones/validaciones').then(c => c.Validaciones) 
},
{ 
        path: 'staff', 
        loadComponent: () => import('./pages/gestionAdministradores/administradores/administradores').then(c => c.Administradores),
        canActivate: [adminGuard] // Solo el ID 1 podrá entrar aquí
      },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  }
];