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
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectButton, TagModule],
  templateUrl: './config-motivos-baja.html',
  styleUrl: './config-motivos-baja.css',
})
export class ConfigMotivosBaja {
  // Recibir el listado de motivos de baja de usuario desde el componente padre
  @Input() motivosBajaUsuario: MotivoBaja[] = [];
  
  // Notificar al componente superior para realizar la persistencia de los datos (Crear/Editar)
  @Output() onSave = new EventEmitter<any>();
  
  // Emitir el evento para cambiar el estado de activación (borrado lógico) de un motivo
  @Output() onToggle = new EventEmitter<MotivoBaja>();

  // Obtener la referencia de la tabla PrimeNG para aplicar filtros de estado manualmente
  @ViewChild('dtMotivosBaja') dtMotivosBaja: Table | undefined;

  // Gestionar la visibilidad y el encabezado dinámico de la ventana modal
  displayMotivoBajaDialog: boolean = false;
  tituloMotivoBajaDialog: string = '';

  // Definir el objeto temporal para el formulario usando una estructura parcial de la interfaz
  nuevoMotivoBaja: Partial<MotivoBaja> = { id: 0, motivo: '' };

  // Configurar las etiquetas y valores para el selector de filtro por estado
  stateOptions = [
    { label: 'Todos', value: 'todos' }, 
    { label: 'Activos', value: 'activo' }, 
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstadoBaja: string = 'todos';

  // Inicializar los campos y mostrar el diálogo para registrar un nuevo motivo
  abrirModal() {
    this.nuevoMotivoBaja = { id: 0, motivo: '' };
    this.tituloMotivoBajaDialog = 'Nuevo Motivo de Baja';
    this.displayMotivoBajaDialog = true;
  }

  // Clonar los datos del motivo seleccionado en el objeto local para su edición
  editar(m: MotivoBaja) {
    this.nuevoMotivoBaja = { ...m };
    this.tituloMotivoBajaDialog = 'Editar Motivo';
    this.displayMotivoBajaDialog = true;
  }

  // Emitir el objeto con los cambios realizados y ocultar la ventana modal
  guardar() {
    if (!this.nuevoMotivoBaja.motivo?.trim()) return;
    this.onSave.emit(this.nuevoMotivoBaja);
    this.displayMotivoBajaDialog = false;
  }

  // Filtrar el contenido de la tabla comparando el estado booleano de la propiedad 'activo'
  filtradoMotivosBaja(event: any) {
    const val = event.value;
    if (val === 'todos') {
      this.dtMotivosBaja?.filter('', 'activo', 'equals');
    } else {
      // Aplicar filtro basado en la comparación booleana del valor seleccionado
      this.dtMotivosBaja?.filter(val === 'activo', 'activo', 'equals');
    }
  }
}