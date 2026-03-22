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

import { Familia, Nivel, TituloAdmin, TituloRequest } from '../../../../../../api/models/Admin/adminModel';

@Component({
  selector: 'app-config-titulos',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, Select, SelectButton, TagModule],
  templateUrl: './config-titulos.html',
  styleUrl: './config-titulos.css',
})
export class ConfigTitulos {
  // Recibir listados y estado de carga desde el componente padre
  @Input() titulos: TituloAdmin[] = [];
  @Input() niveles: Nivel[] = [];
  @Input() familias: Familia[] = [];
  @Input() cargando: boolean = false;
  
  // Notificar acciones de edición, borrado y reactivación al padre
  @Output() onEdit = new EventEmitter<TituloAdmin>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onReactivate = new EventEmitter<TituloAdmin>();
  
  // Emitir los datos para guardar (Crear/Actualizar) usando la interfaz de Request
  @Output() onSave = new EventEmitter<{ id: number } & TituloRequest>();

  // Obtener referencia de la tabla PrimeNG para aplicar filtros programáticos
  @ViewChild('dt') dt: Table | undefined;

  // Controlar la visibilidad y el encabezado del diálogo de formulario
  displayDialog: boolean = false;
  tituloDialog: string = '';

  // Definir el objeto temporal para el formulario con tipos estrictos
  nuevoTitulo: { id: number } & TituloRequest = { 
    id: 0, 
    nombre: '', 
    nivel: null as any, 
    familia: null as any, 
    centro: 1 
  };

  // Configurar las opciones en la tabla para filtrado
  stateOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Activos', value: 'activo' },
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstado: string = 'todos';

  // Preparar el formulario para la creación de una nueva titulación
  abrirNuevo() {
    this.nuevoTitulo = { id: 0, nombre: '', nivel: null as any, familia: null as any, centro: 1 };
    this.tituloDialog = 'Añadir Nueva Titulación';
    this.displayDialog = true;
  }

  // Mapear los datos de la tabla al formulario de edición localizando los IDs correspondientes
  editar(t: TituloAdmin) {
    const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
    const familiaEncontrada = this.familias.find(f => f.nombre === t.familia);
    
    this.nuevoTitulo = {
      id: t.id,
      nombre: t.titulo,
      nivel: nivelEncontrado ? nivelEncontrado.id : null as any,
      familia: familiaEncontrada ? familiaEncontrada.id : null as any,
      centro: 1
    };
    this.tituloDialog = 'Editar Titulación';
    this.displayDialog = true;
  }

  // Validar campos obligatorios y emitir los datos para su persistencia en el backend
  guardar() {
    if (!this.nuevoTitulo.nombre || !this.nuevoTitulo.nivel || !this.nuevoTitulo.familia) {
      return;
    }
    
    this.onSave.emit(this.nuevoTitulo); 
    this.displayDialog = false;
  }

  // Aplicar el filtrado por estado (activo/inactivo) sobre la tabla de datos
  filtradoTitulos(event: any) {
    const val = event.value;
    if (val === 'todos') {
      this.dt?.filter('', 'estado', 'equals');
    } else {
      this.dt?.filter(val, 'estado', 'equals');
    }
  }
}