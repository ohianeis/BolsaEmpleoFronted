import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { DetalleMotivo } from '../../../../../api/models/MotivoCierreOferta/motivoCierreResponse';
@Component({
  selector: 'app-cierre-oferta-dialog',
imports: [CommonModule, DialogModule, ButtonModule, Select, FormsModule],
  templateUrl: './cierre-oferta.html',
  styleUrl: './cierre-oferta.css',
})
export class CierreOfertaDialog {
@Input() visible: boolean = false;
  @Input() motivos: DetalleMotivo[] = [];
  @Input() enviando: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onConfirmar = new EventEmitter<number>();

  detalleSeleccionadoId: number | null = null;

  cerrar() {
    this.detalleSeleccionadoId = null;
    this.visibleChange.emit(false);
  }

  confirmar() {
    if (this.detalleSeleccionadoId) {
      this.onConfirmar.emit(this.detalleSeleccionadoId);
    }
  }
}
