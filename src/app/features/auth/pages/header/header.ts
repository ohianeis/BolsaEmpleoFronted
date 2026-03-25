import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class Header {
  // 'login' mostrará el botón de Registro
  // 'register' o 'password' mostrará el botón de Login
  @Input() mode: 'login' | 'register' | 'password' = 'login';
}