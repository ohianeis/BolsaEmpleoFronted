import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { Navbar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DrawerModule, Navbar, Sidebar],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  menuVisible = false;
  private router = inject(Router);

  ngOnInit() {
    // Verificación de seguridad básica
    if (!sessionStorage.getItem("name")) {
      this.router.navigate(['/login']);
    }
  }
}