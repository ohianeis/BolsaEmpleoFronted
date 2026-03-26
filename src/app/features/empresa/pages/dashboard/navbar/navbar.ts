import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { LogOut } from '../../../../Shared/components/log-out/log-out';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AvatarModule, ButtonModule, LogOut],
  templateUrl: './navbar.html'
})
export class Navbar{
  @Input() nombre: string | null = '';
  @Output() onMenuToggle = new EventEmitter<void>(); // Para abrir el Drawer
}