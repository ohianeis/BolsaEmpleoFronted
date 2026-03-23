import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AdminService } from '../../../../../services/Admin/AdminService';
import { AuthService } from '../../../../../services/auth';
@Component({
  selector: 'app-sidebar',
imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
public adminService = inject(AdminService);
  public authService = inject(AuthService);
  
  @Output() onItemClick = new EventEmitter<void>();

  // Al hacer clic en un enlace
  closeMenu() {
    this.onItemClick.emit();
  }
}
