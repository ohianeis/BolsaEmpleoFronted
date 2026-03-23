import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Drawer } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-empresa-drawer',
  standalone: true,
  imports: [CommonModule, Drawer, ButtonModule],
  templateUrl: './empresa-drawer.html'
})
export class EmpresaDrawer {
 @Input() visible: boolean = false;
  @Input() seleccionada: any = null;

  // Emitimos eventos al padre en lugar de ejecutar la lógica aquí
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onReinscribir = new EventEmitter<number>();
  @Output() onRetirar = new EventEmitter<number>();

  close() {
    this.visibleChange.emit(false);
  }

  // Estos métodos "puente" lanzan el evento hacia el componente Padre
  reInscribirse(id: number) {
    this.onReinscribir.emit(id);
  }

  confirmarDesapuntarse(id: number) {
    this.onRetirar.emit(id);
  }
}