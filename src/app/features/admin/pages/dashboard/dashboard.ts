import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { AdminService } from '../../../../services/Admin/AdminService';
import { Navbar } from "./navbar/navbar";
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DrawerModule, Navbar,Sidebar],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  menuVisible = false;
  private router = inject(Router);
  private adminService = inject(AdminService);

  ngOnInit() {
    const nombreUsuario = sessionStorage.getItem("name");
    if (!nombreUsuario) {
      this.router.navigate(['/login']);
    } else {
      // Cargamos el contador global al iniciar el dashboard
      this.adminService.getPendientesCount().subscribe();
    }
  }
}