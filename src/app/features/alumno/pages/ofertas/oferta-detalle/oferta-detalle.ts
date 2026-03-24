import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DetalleOfertaDemandante } from '../../../../../api/models/Demandantes/demantantesResponse';

@Component({
  selector: 'app-oferta-detalle',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './oferta-detalle.html'
})
export class OfertaDetalle {
  @Input() detalle: DetalleOfertaDemandante | null = null;
  @Input() cargando: boolean = false;
  
  @Output() onInscribirse = new EventEmitter<number>();
  @Output() onVerEmpresa = new EventEmitter<void>();
}