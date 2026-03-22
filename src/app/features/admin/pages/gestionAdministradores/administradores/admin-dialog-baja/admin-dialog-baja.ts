import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MotivoBaja } from '../../../../../../api/models/Bajas/BajaUsuario';

@Component({
  selector: 'app-admin-dialogo-baja',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, SelectModule, ButtonModule, TextareaModule],
  templateUrl: './admin-dialog-baja.html'
})
export class AdminDialogBaja {
  // Gestionar la visibilidad del cuadro de diálogo desde el componente superior
  @Input() visible: boolean = false;
  
  // Recibir el catálogo de motivos de baja disponibles para el selector
  @Input() motivos: MotivoBaja[] = [];
  
  // Controlar el estado visual de carga durante el procesamiento de la baja
  @Input() loading: boolean = false;

  // Notificar cambios en la visibilidad para mantener la sincronización con el padre
  @Output() visibleChange = new EventEmitter<boolean>();
  
  // Emitir la información recolectada para proceder con la baja del administrador
  @Output() bajaAdmin = new EventEmitter<any>();

  // Definir la estructura de datos para capturar el motivo y el comentario de la baja
  bajaData = { motivo_baja_id: null, comentario_baja: '' };

  // Ejecutar el cierre del diálogo y restablecer los campos del formulario
  cerrar() {
    this.visibleChange.emit(false);
    this.bajaData = { motivo_baja_id: null, comentario_baja: '' };
  }
}