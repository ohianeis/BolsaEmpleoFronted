import { Select } from 'primeng/select';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';

// PrimeNG
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TituloAdmin } from '../../../../../api/models/Admin/adminModel';
import { Nivel } from '../../../../../services/Titulos/titulos';
import { AdminService } from '../../../../../services/Admin/AdminService';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule,SelectButton, TableModule, ButtonModule, DialogModule, Select, InputTextModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './config.html',
  styleUrl: './config.css'
})
export class Config implements OnInit {

    // Referencia a la tabla para poder filtrarla por código
  @ViewChild('dt') dt: Table | undefined;
  // Opciones para el filtro de estado
  stateOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Activos', value: 'activo' },   // El valor debe coincidir con lo que devuelve tu backend ('activo')
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstado: string = 'todos';
  titulos: TituloAdmin[] = [];
  niveles: Nivel[] = [];
  cargando: boolean = true;
  

  // Control del Diálogo
  displayDialog: boolean = false;
  tituloDialog: string = '';
  
  // Modelo para el formulario
  nuevoTitulo = {
    id: 0,
    nombre: '',
    nivel: null as number | null,
    centro: 1 // Aquí podrías pillar el ID del centro del admin logueado
  };

  constructor(private adminService: AdminService, private messageService: MessageService) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarNiveles();
  }

  cargarDatos() {
    this.cargando = true;
    this.adminService.getTitulos().subscribe({
      next: (res) => { this.titulos = res.data ?? [];
         this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cargarNiveles() {
    this.adminService.getNiveles().subscribe({
      next: (res) => this.niveles = res.data ?? []
    });
  }

  abrirNuevo() {
    this.nuevoTitulo = { id: 0, nombre: '', nivel: null, centro: 1 };
    this.tituloDialog = 'Añadir Nueva Titulación';
    this.displayDialog = true;
  }

  editar(t: TituloAdmin) {
    // Buscamos el ID del nivel comparando el nombre que viene en la tabla con la lista de niveles
    const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
    
    this.nuevoTitulo = {
      id: t.id,
      nombre: t.titulo,
      nivel: nivelEncontrado ? nivelEncontrado.id : null,
      centro: 1
    };
    this.tituloDialog = 'Editar Titulación';
    this.displayDialog = true;
  }

  guardar() {
    if (!this.nuevoTitulo.nombre || !this.nuevoTitulo.nivel) return;

    const request = {
      nombre: this.nuevoTitulo.nombre,
      nivel: this.nuevoTitulo.nivel,
      centro: this.nuevoTitulo.centro
    };

    if (this.nuevoTitulo.id > 0) {
      this.adminService.actualizarTitulo(this.nuevoTitulo.id, request).subscribe({
        next: (res) => {
          this.messageService.add({severity:'success', summary:'Actualizado', detail: String(res.message)});
          this.cerrarYRefrescar();
        }
      });
    } else {
      this.adminService.crearTitulo(request).subscribe({
        next: (res) => {
          this.messageService.add({severity:'success', summary:'Creado', detail: String(res.message)});
          this.cerrarYRefrescar();
        }
      });
    }
  }

  borrar(id: number) {
    this.adminService.eliminarTitulo(id).subscribe({
      next: (res) => {
        this.messageService.add({severity:'info', summary:'Resultado',detail: String(res.message)});
        this.cargarDatos();
      }
    });
  }

  cerrarYRefrescar() {
    this.displayDialog = false;
    this.cargarDatos();
  }
  // No olvides añadir el método reactivar a tu clase
reactivar(t: TituloAdmin) {
  const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
  
  const request = {
    nombre: t.titulo,
    nivel: nivelEncontrado ? nivelEncontrado.id : 0,
    centro: 1, 
    activado: 1 // Forzamos la reactivación
  };

 this.adminService.actualizarTitulo(t.id, request).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success', 
        summary: 'Reactivado', 
        detail: 'El título vuelve a estar disponible para nuevas ofertas'
      });
      this.cargarDatos(); // Recargamos para ver el cambio de gris a verde
    }
  });
}
  onFilterState(event: any) {
    const val = event.value;
    if (val === 'todos') {
      this.dt?.filter('', 'estado', 'equals'); // Limpia el filtro
    } else {
      this.dt?.filter(val, 'estado', 'equals'); // Filtra por 'activo' o 'inactivo'
    }
  }
}