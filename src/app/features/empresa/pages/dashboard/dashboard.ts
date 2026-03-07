// dashboard.ts
import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- IMPORTACIONES DE PRIMENG ---
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
// En tu archivo dashboard.ts
import { DrawerModule } from 'primeng/drawer';
import { Divider } from 'primeng/divider';
import { LogOut } from "../../../Shared/components/log-out/log-out";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    AvatarModule,
    ButtonModule,
    Divider,
    DrawerModule // ✅ Añádelo aquí
    ,
    LogOut
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Variable para controlar el menú lateral en móvil
  nombreUsuario:string|null='';
  menuVisible: boolean = false;

  constructor(private router: Router) {}
ngOnInit() {
    // Recuperamos el nombre guardado en el login
    this.nombreUsuario = sessionStorage.getItem("name");
   
  }

}