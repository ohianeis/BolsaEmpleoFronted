import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar-empresa',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar-empresa.html'
})
export class SidebarEmpresa {
  @Output() onLinkClick = new EventEmitter<void>(); // Para cerrar el menú en móvil
}