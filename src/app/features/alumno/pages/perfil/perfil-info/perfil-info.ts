import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { PerfilDemandante } from '../../../../../api/models/Demandantes/demantantesResponse';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-perfil-info',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './perfil-info.html'
})
export class PerfilInfo {
  // Recibimos el perfil completo o los datos necesarios
  @Input() perfil: PerfilDemandante | null = null;
  
  // Evento para abrir el drawer de edición en el padre
  @Output() onEditar = new EventEmitter<void>();
}