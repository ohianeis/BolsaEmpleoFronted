import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { MotivoBaja } from '../../../../../../api/models/Bajas/BajaUsuario';
@Component({
  selector: 'app-config-motivos-baja',
imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectButton, TagModule],  templateUrl: './config-motivos-baja.html',
  styleUrl: './config-motivos-baja.css',
})
export class ConfigMotivosBaja {
@Input() motivosBajaUsuario: MotivoBaja[] = [];
  @Output() onSave = new EventEmitter<any>();
  @Output() onToggle = new EventEmitter<MotivoBaja>();

  @ViewChild('dtMotivosBaja') dtMotivosBaja: Table | undefined;

  displayMotivoBajaDialog: boolean = false;
  tituloMotivoBajaDialog: string = '';
  nuevoMotivoBaja: Partial<MotivoBaja> = { id: 0, motivo: '' };

  stateOptions = [{ label: 'Todos', value: 'todos' }, { label: 'Activos', value: 'activo' }, { label: 'Inactivos', value: 'inactivo' }];
  filtroEstadoBaja: string = 'todos';

  abrirModal() {
    this.nuevoMotivoBaja = { id: 0, motivo: '' };
    this.tituloMotivoBajaDialog = 'Nuevo Motivo de Baja';
    this.displayMotivoBajaDialog = true;
  }

  editar(m: MotivoBaja) {
    this.nuevoMotivoBaja = { ...m };
    this.tituloMotivoBajaDialog = 'Editar Motivo';
    this.displayMotivoBajaDialog = true;
  }

  guardar() {
    this.onSave.emit(this.nuevoMotivoBaja);
    this.displayMotivoBajaDialog = false;
  }

  filtradoMotivosBaja(event: any) {
    const val = event.value;
    if (val === 'todos') this.dtMotivosBaja?.filter('', 'activo', 'equals');
    else this.dtMotivosBaja?.filter(val === 'activo', 'activo', 'equals');
  }
}
