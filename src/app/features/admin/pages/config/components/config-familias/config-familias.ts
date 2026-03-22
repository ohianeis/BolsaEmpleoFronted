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
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectButton, TagModule],
  templateUrl: './config-familias.html',
  styleUrl: './config-familias.css',
})
export class ConfigFamilias {
  // Recibir el listado de familias profesionales desde el componente padre
  @Input() familias: Familia[] = [];

  // Notificar al componente padre para guardar cambios (Crear/Editar)
  @Output() onSave = new EventEmitter<any>();

  // Emitir el identificador de la familia para su desactivación
  @Output() onDelete = new EventEmitter<number>();

  // Emitir el identificador de la familia para su reactivación
  @Output() onReactivate = new EventEmitter<number>();

  // Obtener referencia de la tabla PrimeNG para gestionar los filtros de estado
  @ViewChild('dtFamilias') dtFamilias: Table | undefined;

  // Controlar la visibilidad y el encabezado dinámico del diálogo de formulario
  displayFamiliaDialog: boolean = false;
  tituloFamiliaDialog: string = '';

  // Definir el objeto temporal de creacion familia nueva
  nuevaFamilia = { id: 0, nombre: '' };
  
  // Configurar las opciones de filtrado para tabla filtrado
  stateOptions = [
    { label: 'Todos', value: 'todos' }, 
    { label: 'Activos', value: 'activo' }, 
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstadoFamilia: string = 'todos';

  // Inicializar el objeto y mostrar el diálogo para crear una nueva familia
  abrirModal() {
    this.nuevaFamilia = { id: 0, nombre: '' };
    this.tituloFamiliaDialog = 'Nueva Familia Profesional';
    this.displayFamiliaDialog = true;
  }

  // Clonar los datos de la familia seleccionada para su edición en el formulario
  editar(f: Familia) {
    this.nuevaFamilia = { ...f };
    this.tituloFamiliaDialog = 'Editar Familia';
    this.displayFamiliaDialog = true;
  }

  // Validar la entrada y emitir los datos de la familia para su persistencia
  guardar() {
    if (!this.nuevaFamilia.nombre?.trim()) return;
    this.onSave.emit(this.nuevaFamilia);
    this.displayFamiliaDialog = false;
  }

  // Aplicar el filtro sobre la tabla basándose en el estado booleano 'activa'
  filtradoFamilia(event: any) {
    const val = event.value;
    if (val === 'todos') {
      this.dtFamilias?.filter('', 'activa', 'equals');
    } else {
      // Filtrar comparando contra el valor booleano (true para activo)
      this.dtFamilias?.filter(val === 'activo', 'activa', 'equals');
    }
  }
}