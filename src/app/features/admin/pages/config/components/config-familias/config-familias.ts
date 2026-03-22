import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Familia } from '../../../../../../api/models/Admin/adminModel';
@Component({
  selector: 'app-config-familias',
imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectButton, TagModule],  templateUrl: './config-familias.html',
  styleUrl: './config-familias.css',
})
export class ConfigFamilias {
@Input() familias: Familia[] = [];
  @Output() onSave = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onReactivate = new EventEmitter<number>();

  @ViewChild('dtFamilias') dtFamilias: Table | undefined;

  displayFamiliaDialog: boolean = false;
  tituloFamiliaDialog: string = '';
  nuevaFamilia = { id: 0, nombre: '' };
  
  stateOptions = [{ label: 'Todos', value: 'todos' }, { label: 'Activos', value: 'activo' }, { label: 'Inactivos', value: 'inactivo' }];
  filtroEstadoFamilia: string = 'todos';

  abrirModal() {
    this.nuevaFamilia = { id: 0, nombre: '' };
    this.tituloFamiliaDialog = 'Nueva Familia Profesional';
    this.displayFamiliaDialog = true;
  }

  editar(f: Familia) {
    this.nuevaFamilia = { ...f };
    this.tituloFamiliaDialog = 'Editar Familia';
    this.displayFamiliaDialog = true;
  }

  guardar() {
    this.onSave.emit(this.nuevaFamilia);
    this.displayFamiliaDialog = false;
  }

  filtradoFamilia(event: any) {
    const val = event.value;
    if (val === 'todos') this.dtFamilias?.filter('', 'activa', 'equals');
    else this.dtFamilias?.filter(val === 'activo', 'activa', 'equals');
  }
}
