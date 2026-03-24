import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OfertaDemandante } from '../../../../../api/models/Demandantes/demantantesResponse';

@Component({
  selector: 'app-oferta-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './oferta-card.html'
})
export class OfertaCard {
  @Input({ required: true }) oferta!: OfertaDemandante;
  @Input() isExpanded: boolean = false;
  @Output() onToggle = new EventEmitter<void>();

  // Helper para el color del círculo de afinidad
  getAfinidadClass(): string {
    const match = this.oferta.matchAfinidad;
    if (match >= 70) return 'bg-emerald-500';
    if (match >= 40) return 'bg-orange-500';
    return 'bg-red-400';
  }
}