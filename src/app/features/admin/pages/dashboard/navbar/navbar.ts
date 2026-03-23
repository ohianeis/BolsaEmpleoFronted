import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { LogOut } from '../../../../Shared/components/log-out/log-out';
import { AuthService } from '../../../../../services/auth';
@Component({
  selector: 'app-navbar',
imports: [CommonModule, ButtonModule, AvatarModule, LogOut],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
public authService = inject(AuthService);
  
  // Avisamos al padre para que abra el Drawer en móvil
  @Output() onMenuToggle = new EventEmitter<void>();

  toggleMenu() {
    this.onMenuToggle.emit();
  }
}
