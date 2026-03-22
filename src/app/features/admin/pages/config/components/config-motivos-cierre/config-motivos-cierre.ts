import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { DetalleMotivo } from '../../../../../../api/models/MotivoCierreOferta/motivoCierreResponse';
@Component({
  selector: 'app-config-motivos-cierre',
imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectButton, TagModule],  templateUrl: './config-motivos-cierre.html',
  styleUrl: './config-motivos-cierre.css',
})
export class ConfigMotivosCierre {
@Input() detalles: DetalleMotivo[] = [];
  @Output() onSave = new EventEmitter<any>();
  @Output() onToggle = new EventEmitter<DetalleMotivo>();

  @ViewChild('dtDetalles') dtDetalles: Table | undefined;

  displayDetalleDialog: boolean = false;
  tituloDetalleDialog: string = '';
  nuevoDetalle = { id: 0, nombre: '', motivo_id: 2 };

  stateOptions = [{ label: 'Todos', value: 'todos' }, { label: 'Activos', value: 'activo' }, { label: 'Inactivos', value: 'inactivo' }];
  filtroEstadoMotivo: string = 'todos';

  abrirModal() {
    this.nuevoDetalle = { id: 0, nombre: '', motivo_id: 2 };
    this.tituloDetalleDialog = 'Nueva Razón de Cierre';
    this.displayDetalleDialog = true;
  }

  editar(d: DetalleMotivo) {
    this.nuevoDetalle = { id: d.id, nombre: d.nombre, motivo_id: d.motivo_id };
    this.tituloDetalleDialog = 'Editar Razón';
    this.displayDetalleDialog = true;
  }

  guardar() {
    this.onSave.emit(this.nuevoDetalle);
    this.displayDetalleDialog = false;
  }

  filtradoMotivos(event: any) {
    const val = event.value;
    if (val === 'todos') this.dtDetalles?.filter('', 'activo', 'equals');
    else this.dtDetalles?.filter(val === 'activo', 'activo', 'equals');
  }
}
