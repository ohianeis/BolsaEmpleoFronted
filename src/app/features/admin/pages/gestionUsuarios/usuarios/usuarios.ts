import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs'; 
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Importa aquí tus 4 nuevos componentes
import { TableModule } from 'primeng/table';
import { TablaAlumnos } from "./tabla-alumnos/tabla-alumnos";
import { TablaEmpresas } from "./tabla-empresas/tabla-empresas";
import { HistorialBajas } from "./historial-bajas/historial-bajas";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    ToastModule,
    TableModule,
    TablaAlumnos,
    TablaEmpresas,
    HistorialBajas
],
  providers: [MessageService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  @Input() tab?: string;
  activeIndex: number = 0;
  @ViewChild(TablaAlumnos) tablaAlumnos!: TablaAlumnos;
  @ViewChild(TablaEmpresas) tablaEmpresas!: TablaEmpresas;
@ViewChild(HistorialBajas) historialComponent!: HistorialBajas;
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Si la URL viene con un tab específico, lo activamos
    if (this.tab === 'empresas') this.activeIndex = 1;
    if (this.tab === 'bajas') this.activeIndex = 2;
  }

  onTabChange(value: any): void {
    const index = Number(value);
    if (isNaN(index)) return;
    this.activeIndex = index;
    if (index === 2 && this.historialComponent) {
      this.historialComponent.dtBajas?.reset();
    }
  }

  refreshAll(): void {
    this.tablaAlumnos?.dtAlumnos?.reset(); 
    this.tablaEmpresas?.dtEmpresas?.reset();
    this.historialComponent?.dtBajas?.reset();
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Actualizando', 
      detail: 'Datos actualizados.' 
    });
  }
}