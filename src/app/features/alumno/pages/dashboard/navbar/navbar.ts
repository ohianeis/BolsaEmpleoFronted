import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { LogOut } from '../../../../Shared/components/log-out/log-out';
@Component({
  selector: 'app-navbar',
imports: [CommonModule, ButtonModule, AvatarModule, LogOut],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
@Output() onMenuToggle = new EventEmitter<void>();
  
  nombreUsuario: string = '';

  ngOnInit() {
    // Recuperamos el nombre para el saludo
    this.nombreUsuario = sessionStorage.getItem('name') || 'Candidato';
  }

  toggleMenu() {
    this.onMenuToggle.emit();
  }
}
