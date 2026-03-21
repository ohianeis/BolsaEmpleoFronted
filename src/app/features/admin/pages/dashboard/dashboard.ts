import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer'; // O SidebarModule según tu versión
import { DividerModule } from 'primeng/divider';
import { AdminService } from '../../../../services/Admin/AdminService';
import { LogOut } from "../../../Shared/components/log-out/log-out";
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-dashboard',
 imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, DrawerModule, DividerModule, LogOut],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  nombreUsuario: string | null = '';
  menuVisible: boolean = false;
public adminService=inject(AdminService)
private router=inject(Router)
public authService=inject(AuthService);
  constructor() {}

  ngOnInit() {
    // 1. Recuperamos el nombre del administrador del sessionStorage
    this.nombreUsuario = sessionStorage.getItem("name");

    // 2. [Opcional] Verificación de seguridad básica
    // Si no hay nombre o token, lo mandamos al login
    if (!this.nombreUsuario) {
      this.router.navigate(['/login']);
    }else {
    
     this.adminService.getPendientesCount().subscribe();
    }
  }

 
}
