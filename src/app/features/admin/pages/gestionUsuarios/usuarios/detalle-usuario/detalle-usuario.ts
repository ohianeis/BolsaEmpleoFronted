import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detalle-usuario',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './detalle-usuario.html'
})
export class DetalleUsuario {
  // Recibe los datos del alumno desde el componente Alumnos
  @Input() alumno: any = null;

  // Avisa al componente Alumnos si se quiere tramitar una baja
  @Output() onTramitarBaja = new EventEmitter<any>();

  abrirBaja() {
    this.onTramitarBaja.emit(this.alumno);
  }

  // Helpers de estilo que tenías en el original
  getValidadoSeverity(validado: number): "success" | "warn" | "secondary" {
    return validado === 1 ? 'success' : 'warn';
  }

  getValidadoLabel(validado: number): string {
    return validado === 1 ? 'USUARIO VALIDADO' : 'PENDIENTE DE VALIDAR';
  }
}