import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth'; 

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ayuda.html'
})
export class Ayuda implements OnInit {
  private authService = inject(AuthService);
  
  // Usamos los nombres exactos que vienen de tu backend
  rolUsuario: string | null = null;

  ngOnInit() {
    // suscribir al  al rol actual. 
    // Si hubo F5, el servicio llamará a /perfil-auth automáticamente.
    this.authService.getRolActual().subscribe(rol => {
      this.rolUsuario = rol;
    });
  }
}