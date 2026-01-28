import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ayuda.html'
})
export class Ayuda implements OnInit {
  private route = inject(ActivatedRoute);
  rolUsuario: 'alumno' | 'empresa' | 'centro' = 'alumno';

  ngOnInit() {
    // Leemos el rol desde la data de la ruta
    this.rolUsuario = this.route.snapshot.data['role'] || 'alumno';
  }
}