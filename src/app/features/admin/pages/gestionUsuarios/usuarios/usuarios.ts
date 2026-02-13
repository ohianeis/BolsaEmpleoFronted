import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs'; 
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import {  ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { AdminService } from '../../../../../services/Admin/AdminService';
import { FormsModule } from '@angular/forms';

import { Select } from 'primeng/select';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
    TabsModule,
    TableModule, 
    ToastModule,
    TagModule, 
    DrawerModule,
    ButtonModule, 
    FormsModule,
    Select,
    SkeletonModule
  ],
  providers:[MessageService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  @Input() tab?: string;

  activeIndex: number = 0;
  alumnos: any[] = [];
  empresas: any[] = [];
  loadingAlumnos: boolean = false;
  loadingEmpresas: boolean = false;

  selectedAlumno: any = null;
visibleAlumnoDrawer: boolean = false;

selectedEmpresa: any = null;
visibleEmpresaDrawer: boolean = false;

titulosDisponibles: any[] = [];
  constructor(private adminService: AdminService, private messageService:MessageService) {}

  ngOnInit(): void {
    // Si la URL dice ?tab=empresas, activamos el índice 1
    this.activeIndex = this.tab === 'empresas' ? 1 : 0;
    this.cargarData(this.activeIndex);
    this.getTitulosFiltro();
  }

  // Corregido para PrimeNG v18: recibe el string del value directamente
  onTabChange(value: string | number): void {
    const index = Number(value);
    this.activeIndex = index;
    this.cargarData(index);
  }
getTitulosFiltro(): void {
  this.adminService.getTitulos().subscribe({
    next: (res) => {
      if (res && res.data) {
        this.titulosDisponibles = res.data.map((t: any) => ({
          label: t.titulo.toUpperCase(), // Usamos 'titulo' que es lo que viene en tu JSON
          value: t.titulo               // Valor para filtrar
        }));
      }
    }
  });
}
private mostrarError(mensaje: string,tipoResultado:string) {
    this.messageService.add({
      severity: 'error',
      summary: tipoResultado,
      detail: mensaje,
      life: 5000
    });
  }
  cargarData(index: number): void {
    if (index === 0 && this.alumnos.length === 0) {
      this.getAlumnos();
    } else if (index === 1 && this.empresas.length === 0) {
      this.getEmpresas();
    }
  }

getAlumnos(): void {
  this.loadingAlumnos = true;
  this.adminService.getAllAlumnos().subscribe({
    next: (res) => {
      // 1. Verificamos que res y res.data existan
      if (res && res.data) {
        this.alumnos = res.data.map((alumno: any) => {
          // 2. Creamos el string de búsqueda de forma segura
          let titulosStr = '';
          if (Array.isArray(alumno.titulos)) {
            // Si es un array de strings (['DAM', 'DAW'])
            titulosStr = alumno.titulos.join(', ');
          } else if (alumno.titulos && typeof alumno.titulos === 'object') {
            // Si es un array de objetos (del detalle), sacamos solo el nombre
            titulosStr = Object.values(alumno.titulos).map((t: any) => t.nombre || t).join(', ');
          }

          return {
            ...alumno,
            titulosBusqueda: titulosStr.toLowerCase() // Lo pasamos a minúsculas para facilitar el filtro
          };
        });
        console.log('Alumnos procesados con éxito:', this.alumnos);
      } else {
        this.alumnos = [];
        this.mostrarError( 'No hay alumnos actualmente', 'Datos obtenidos')
      }
      this.loadingAlumnos = false;
    },
    error: (err) => {
     this.mostrarError(err.error.message,'Error al obtener los datos')
      this.loadingAlumnos = false;
      this.alumnos = [];
    }
  });
}
 getEmpresas(): void {
  this.loadingEmpresas = true;
  this.adminService.getAllEmpresas().subscribe({
    next: (res) => {
      // 1. Verificamos que existan datos y que la lista no esté vacía
      if (res && res.data && res.data.length > 0) {
        this.empresas = res.data;
      } else {
        this.empresas = [];
        // Si la respuesta fue exitosa pero no hay datos, avisamos
        this.mostrarError( 'No hay empresas colaboradoras por el momento','Datos obtenidos');
      }
      this.loadingEmpresas = false;
    },
    error: (err) => {
     this.mostrarError(err.error.message,'Error al obtener los datos')

      this.loadingEmpresas = false;
      this.empresas = [];
    }
  });
}

  // Métodos de utilidad para el HTML
  getValidadoSeverity(validado: number): "success" | "warn" | "danger" | "secondary" | "info" {
    return validado === 1 ? 'success' : 'warn';
  }

  getValidadoLabel(validado: number): string {
    return validado === 1 ? 'VALIDADO' : 'PENDIENTE';
  }

 verDetalleAlumno(alumno: any) {
  
  this.visibleAlumnoDrawer = false; 
  this.selectedAlumno = null;

  this.adminService.getDetalleAlumno(alumno.id).subscribe({
    next: (res) => {
      this.selectedAlumno = res.data;
      // 2. Usamos un pequeño delay o simplemente asignamos
      // Esto asegura que Angular detecte el cambio de datos y luego abra el panel
      setTimeout(() => {
        this.visibleAlumnoDrawer = true;
      }, 50);
    },
    error: (err) => console.error('Error al cargar detalle del alumno', err)
  });
}

// MÉTODO PARA EMPRESAS
verDetalleEmpresa(empresa: any) {
  this.selectedEmpresa = null;
  this.adminService.getDetalleEmpresa(empresa.id).subscribe({
    next: (res) => {
      this.selectedEmpresa = res.data;
      this.visibleEmpresaDrawer = true;
    },
    error: (err) => console.error('Error al cargar detalle de empresa', err)
  });
}
// En usuarios.ts

// Esta función permite que p-table sepa cómo filtrar dentro del array de títulos
customFilterTítulos(value: string[], filter: string): boolean {
  if (!filter) return true;
  return value.some(t => t.toLowerCase().includes(filter.toLowerCase()));
}
}