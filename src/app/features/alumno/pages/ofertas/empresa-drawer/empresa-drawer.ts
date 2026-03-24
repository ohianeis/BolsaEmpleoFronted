import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-empresa-drawer',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule],
  templateUrl: './empresa-drawer.html'
})
export class EmpresaDrawer {
  @Input() visible: boolean = false;
  @Input() empresa: any = null; // Aquí podrías crear una Interface 'EmpresaDetalle' si quieres ser 100% estricto
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onInscribirse = new EventEmitter<void>();

  close() {
    this.visibleChange.emit(false);
  }
}