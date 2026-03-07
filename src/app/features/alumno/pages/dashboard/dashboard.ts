import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { LogOut } from "../../../Shared/components/log-out/log-out";
@Component({
  selector: 'app-dashboard',
imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DrawerModule,
    AvatarModule,
    LogOut
],  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
// Control del menú en móviles
  menuVisible: boolean = false;
  
  // Datos del usuario
  nombreUsuario: string = 'Usuario';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Recuperamos el nombre del usuario guardado en el login
    // Ajusta la clave 'usuario' según como la guardes en el sessionStorage
    const userSession = sessionStorage.getItem('name');
    if (userSession) {
      
      this.nombreUsuario = userSession || 'Candidato';
    }
  }


}
