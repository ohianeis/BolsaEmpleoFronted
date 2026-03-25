import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { Direccion } from '../../../../../api/models/Admin/adminModel'; // Ajusta la ruta a donde tengas Direccion
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-direccion-card',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './direccion-card.html'
})
export class DireccionCard {
  @Input() direccion: Direccion | null | undefined = null;
  
  // Evento para avisar al padre que queremos editar
  @Output() onEditar = new EventEmitter<void>();
}