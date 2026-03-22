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
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectButton, TagModule],
  templateUrl: './config-motivos-cierre.html',
  styleUrl: './config-motivos-cierre.css',
})
export class ConfigMotivosCierre {
  // Recibir el listado de detalles de cierre (razones específicas) desde el padre
  @Input() detalles: DetalleMotivo[] = [];
  
  // Notificar al componente superior para persistir cambios o crear nuevos registros
  @Output() onSave = new EventEmitter<{ id: number; nombre: string; motivo_id: number }>();
  
  // Emitir el evento para alternar el estado (activo/inactivo) de un motivo
  @Output() onToggle = new EventEmitter<DetalleMotivo>();

  // Obtener referencia a la tabla de PrimeNG para gestionar los filtros de estado
  @ViewChild('dtDetalles') dtDetalles: Table | undefined;

  // Gestionar la visibilidad y el texto dinámico del cuadro de diálogo
  displayDetalleDialog: boolean = false;
  tituloDetalleDialog: string = '';

  // Inicializar el objeto temporal con el motivo_id predefinido (generalmente 2: No Asignación)
  nuevoDetalle = { id: 0, nombre: '', motivo_id: 2 };

  // Configurar las opciones visuales para el filtro de estados
  stateOptions = [
    { label: 'Todos', value: 'todos' }, 
    { label: 'Activos', value: 'activo' }, 
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstadoMotivo: string = 'todos';

  // Reiniciar el formulario y mostrar el diálogo para una nueva creación
  abrirModal() {
    this.nuevoDetalle = { id: 0, nombre: '', motivo_id: 2 };
    this.tituloDetalleDialog = 'Nueva Razón de Cierre';
    this.displayDetalleDialog = true;
  }

  // Cargar los datos del motivo seleccionado en el formulario para su edición
  editar(d: DetalleMotivo) {
    this.nuevoDetalle = { id: d.id, nombre: d.nombre, motivo_id: d.motivo_id };
    this.tituloDetalleDialog = 'Editar Razón';
    this.displayDetalleDialog = true;
  }

  // Emitir los datos capturados y cerrar la ventana modal
  guardar() {
    if (!this.nuevoDetalle.nombre.trim()) return;
    this.onSave.emit(this.nuevoDetalle);
    this.displayDetalleDialog = false;
  }

  // Ejecutar el filtrado lógico en la tabla basándose en el booleano 'activo'
  filtradoMotivos(event: any) {
    const val = event.value;
    if (val === 'todos') {
      this.dtDetalles?.filter('', 'activo', 'equals');
    } else {
      // Filtrar comparando contra el valor booleano exacto (true/false)
      this.dtDetalles?.filter(val === 'activo', 'activo', 'equals');
    }
  }
}