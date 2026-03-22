import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-dialogo-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, ButtonModule],
  templateUrl: './admin-dialog-crear.html'
})
export class AdminDialogCrear {
  // Controlar la visibilidad del diálogo desde el componente padre
  @Input() visible: boolean = false;
  
  // Recibir los datos de la contraseña temporal una vez generada por el servidor
  @Input() resetData: any = null; 

  // Notificar cambios en la visibilidad para sincronizar con el padre 
  @Output() visibleChange = new EventEmitter<boolean>();
  
  // Emitir los datos del formulario al confirmar la creación del administrador
  @Output() newAdmin = new EventEmitter<any>();
  
  // Notificar la acción de copiado de la contraseña temporal al portapapeles
  @Output() copiar = new EventEmitter<string>();

  // Definir el objeto temporal para capturar los datos del nuevo administrador
  nuevoAdmin = { name: '', email: '' };

  // Gestionar el cierre del diálogo y resetear el formulario a su estado inicial
  cerrar() {
    this.visibleChange.emit(false);
    this.nuevoAdmin = { name: '', email: '' };
  }

  // Emitir el evento de confirmación con los datos recolectados en el formulario
  confirmar() {
    this.newAdmin.emit(this.nuevoAdmin);
  }
}