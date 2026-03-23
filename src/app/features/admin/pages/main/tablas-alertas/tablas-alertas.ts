import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { EmpresaInforme, OfertaInforme } from '../../../../../api/models/Admin/informesModule';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tablas-alertas',
imports: [CommonModule, TableModule, TagModule, SkeletonModule, TooltipModule],
  templateUrl: './tablas-alertas.html',
  styleUrl: './tablas-alertas.css',
})
export class TablasAlertas {
// Datos tipados que vienen del Main
  @Input() empresasInactivas: EmpresaInforme[] = [];
  @Input() ofertasVacias: OfertaInforme[] = [];
  @Input() loading: boolean = false;

  // Eventos para avisar al Padre que queremos ver un detalle
  @Output() onDetalleEmpresa = new EventEmitter<EmpresaInforme>();
  @Output() onDetalleOferta = new EventEmitter<OfertaInforme>();

  /**
   * Emitir la empresa seleccionada al padre
   */
  verEmpresa(empresa: EmpresaInforme): void {
    this.onDetalleEmpresa.emit(empresa);
  }

  /**
   * Emitir la oferta seleccionada al padre
   */
  verOferta(oferta: OfertaInforme): void {
    this.onDetalleOferta.emit(oferta);
  }
}
