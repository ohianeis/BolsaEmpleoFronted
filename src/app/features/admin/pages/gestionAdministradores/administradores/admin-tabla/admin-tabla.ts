import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AdminUser } from '../../../../../../api/models/Admin/gestionAdmin';

@Component({
  selector: 'app-admin-tabla',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule],
  templateUrl: './admin-tabla.html'
})
export class AdminTabla {
  // Recibir el listado de usuarios administradores desde el componente padre
  @Input() usuarios: AdminUser[] = [];
  
  // Definir el total de registros para el control de la paginación
  @Input() totalRecords: number = 0;
  
  // Controlar el estado visual de carga de la tabla
  @Input() loading: boolean = false;
  
  // Establecer la cantidad de filas visibles por página
  @Input() rows: number = 10;

  // Notificar al padre la solicitud de nueva carga de datos (paginación/ordenación)
  @Output() onLazyLoad = new EventEmitter<any>();
  
  // Emitir evento para abrir el formulario de creación de nuevo staff
  @Output() onCreate = new EventEmitter<void>();
  
  // Notificar la intención de resetear la contraseña de un usuario específico
  @Output() onResetPass = new EventEmitter<number>();
  
  // Emitir el identificador del usuario para iniciar el proceso de baja
  @Output() onBaja = new EventEmitter<number>();
  
  // Notificar la solicitud de reactivación de un acceso previamente inhabilitado
  @Output() onReactivar = new EventEmitter<number>();

  // Verificar si el identificador corresponde al administrador principal del sistema
  isSuperAdmin(id: number): boolean {
    return id === 1;
  }
}