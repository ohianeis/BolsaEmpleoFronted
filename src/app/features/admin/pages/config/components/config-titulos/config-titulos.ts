import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Familia, Nivel, TituloAdmin } from '../../../../../../api/models/Admin/adminModel';

@Component({
  selector: 'app-config-titulos',
imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, Select, SelectButton, TagModule],  templateUrl: './config-titulos.html',
  styleUrl: './config-titulos.css',
})
export class ConfigTitulos {
@Input() titulos: TituloAdmin[] = [];
  @Input() niveles: Nivel[] = [];
  @Input() familias: Familia[] = [];
  @Input() cargando: boolean = false;
  
  @Output() onEdit = new EventEmitter<TituloAdmin>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onReactivate = new EventEmitter<TituloAdmin>();
  @Output() onSave = new EventEmitter<any>();

  @ViewChild('dt') dt: Table | undefined;

  displayDialog: boolean = false;
  tituloDialog: string = '';
  nuevoTitulo = { id: 0, nombre: '', nivel: null as number | null, familia: null as number | null, centro: 1 };

  stateOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Activos', value: 'activo' },
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstado: string = 'todos';

  abrirNuevo() {
    this.nuevoTitulo = { id: 0, nombre: '', nivel: null, familia: null, centro: 1 };
    this.tituloDialog = 'Añadir Nueva Titulación';
    this.displayDialog = true;
  }

  editar(t: TituloAdmin) {
    const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
    const familiaEncontrada = this.familias.find(f => f.nombre === t.familia);
    this.nuevoTitulo = {
      id: t.id,
      nombre: t.titulo,
      nivel: nivelEncontrado ? nivelEncontrado.id : null,
      familia: familiaEncontrada ? familiaEncontrada.id : null,
      centro: 1
    };
    this.tituloDialog = 'Editar Titulación';
    this.displayDialog = true;
  }

 guardar() {

  if (!this.nuevoTitulo.nombre || !this.nuevoTitulo.nivel || !this.nuevoTitulo.familia) {
    // Podrías emitir un mensaje de aviso aquí si quieres
    return;
  }
  
  
  this.onSave.emit(this.nuevoTitulo); 
  this.displayDialog = false;
}

  filtradoTitulos(event: any) {
    const val = event.value;
    if (val === 'todos') this.dt?.filter('', 'estado', 'equals');
    else this.dt?.filter(val, 'estado', 'equals');
  }
}
