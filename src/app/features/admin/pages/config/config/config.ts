import { Select } from 'primeng/select';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';

// PrimeNG
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Familia,TituloAdmin,TituloRequest } from '../../../../../api/models/Admin/adminModel';
import { Nivel } from '../../../../../services/Titulos/titulos';
import { AdminService } from '../../../../../services/Admin/AdminService';
import { CierreOferta } from '../../../../../services/MotivosCierreOferta/cierre-oferta';
import { DetalleMotivo, Motivo } from '../../../../../api/models/MotivoCierreOferta/motivoCierreResponse';
import { MotivoBaja } from '../../../../../api/models/Bajas/BajaUsuario';
import { BajaUsuario } from '../../../../../services/Baja/baja-usuario';
import { TooltipModule } from 'primeng/tooltip';
import { ConfigTitulos } from "../components/config-titulos/config-titulos";
import { ConfigFamilias } from '../components/config-familias/config-familias';
import { ConfigMotivosBaja } from '../components/config-motivos-baja/config-motivos-baja';
import { ConfigMotivosCierre } from '../components/config-motivos-cierre/config-motivos-cierre';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, TooltipModule,FormsModule,TableModule, ButtonModule, DialogModule, InputTextModule, TagModule, ToastModule, ConfigTitulos,ConfigFamilias,ConfigMotivosBaja,ConfigMotivosCierre],
  providers: [MessageService],
  templateUrl: './config.html',
  styleUrl: './config.css'
})


export class Config implements OnInit {
  // 1. Datos para los hijos
  titulos: TituloAdmin[] = [];
  niveles: Nivel[] = [];
  familias: Familia[] = [];
  detalles: DetalleMotivo[] = [];
  motivosBajaUsuario: MotivoBaja[] = [];
  cargando: boolean = true;

  // Inyecciones
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);
  private detalleMotivosService = inject(CierreOferta);
  private bajaUsuarioService = inject(BajaUsuario);

  ngOnInit() {
    this.cargarDatos(); // Titulos
    this.cargarNiveles();
    this.cargarFamilias();
    this.cargarMotivos(); // Cierre oferta
    this.cargarMotivosBajaUsuario();
  }

  // --- MÉTODOS DE CARGA (Sin cambios, los que ya tienes) ---
  cargarDatos() {
    this.cargando = true;
    this.adminService.getTitulos().subscribe({
      next: (res) => { this.titulos = res.data ?? []; this.cargando = false; },
      error: () => this.cargando = false
    });
  }
  
  cargarFamilias() { 
    this.adminService.getFamilias().subscribe({
      next: (res) => this.familias = res.data ?? []
    });
  }

  cargarMotivos() {
    this.detalleMotivosService.getConfiguracionAdmin().subscribe({
      next: (res) => {
        const motivoNoAsignacion = res.data?.find(m => m.id === 2);
        this.detalles = motivoNoAsignacion?.detalles ? [...motivoNoAsignacion.detalles] : [];
      }
    });
  }

  cargarMotivosBajaUsuario() {
    this.bajaUsuarioService.getMotivos().subscribe({
      next: (res) => this.motivosBajaUsuario = res.data ?? []
    });
  }

  cargarNiveles() {
    this.adminService.getNiveles().subscribe({
      next: (res) => this.niveles = res.data ?? []
    });
  }

  // --- MÉTODOS DE ACCIÓN (Los que llaman los @Output de los hijos) ---

  // Gestión de Títulos
// DENTRO DE config.ts

guardarTitulo(datos: any) {
  // 'datos' es el objeto que viene del hijo (nuevoTitulo)
  // IMPORTANTE: Asegúrate de que los nombres de los campos coincidan con tu TituloRequest
  const request: TituloRequest = {
    nombre: datos.nombre,
    nivel: datos.nivel,   // Aquí ya viene el ID desde el p-select del hijo
    familia: datos.familia, // Aquí ya viene el ID desde el p-select del hijo
    centro: 1
  };

  if (datos.id > 0) {
    this.adminService.actualizarTitulo(datos.id, request).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: String(res.message) });
        this.cargarDatos();
      },
      error: (err) => this.mostrarErrorValidacion(err)
    });
  } else {
    this.adminService.crearTitulo(request).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: String(res.message) });
        this.cargarDatos();
      },
      error: (err) => this.mostrarErrorValidacion(err)
    });
  }
}

// Método auxiliar para ver qué dice el error 422 exactamente
private mostrarErrorValidacion(err: any) {
  console.error("Detalles del error 422:", err.error);
  const detalle = err.error?.errors 
    ? Object.values(err.error.errors).flat().join(', ') 
    : (err.error?.message || 'Error de validación');
    
  this.messageService.add({
    severity: 'error',
    summary: 'Error en los datos',
    detail: detalle,
    sticky: true
  });
}

  borrarTitulo(id: number) {
    this.adminService.eliminarTitulo(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Título desactivado' });
        this.cargarDatos();
      }
    });
  }

 reactivarTitulo(t: TituloAdmin) {
  //  Buscamor los IDs correspondientes a los nombres que vienen en la tabla
  const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
  const familiaEncontrada = this.familias.find(f => f.nombre === t.familia);

  //  Construir el request EXACTO que espera el servidor para un Update
  const request = {
    nombre: t.titulo, // En la tabla es t.titulo, el server espera 'nombre'
    nivel: nivelEncontrado!.id,
    familia: familiaEncontrada!.id,
    centro: 1,
    activado: 1 // forzar reactivacion
  };

  this.adminService.actualizarTitulo(t.id, request).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Reactivado', detail: 'Título disponible' });
      this.cargarDatos();
    },
    error: (err) => this.mostrarErrorValidacion(err)
  });
}

  // Gestión de Familias
  guardarFamilia(f: any) {
    const request = { nombre: f.nombre };
    const accion = f.id > 0 
      ? this.adminService.actualizarFamilia(f.id, request) 
      : this.adminService.crearFamilia(request);

    accion.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Familia guardada' });
        this.cargarFamilias();
      }
    });
  }

  borrarFamilia(id: number) {
    this.adminService.eliminarFamilia(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Familia desactivada' });
        this.cargarFamilias();
        this.cargarDatos();//carga titulos otra vez ya que se ponen inactivos
      }
    });
  }

  reactivarFamilia(id: number) {
    this.adminService.actualizarFamilia(id, { activa: true }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Familia reactivada' });
        this.cargarFamilias();
      }
    });
  }

  // Gestión de Motivos Cierre
  guardarDetalleCierre(d: any) {
    const accion = d.id > 0 
      ? this.detalleMotivosService.actualizarDetalle(d.id, d) 
      : this.detalleMotivosService.crearDetalle(d);
    
    accion.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Razón guardada' });
        this.cargarMotivos();
      }
    });
  }

  toggleEstadoDetalle(detalle: DetalleMotivo) {
    this.detalleMotivosService.actualizarDetalle(detalle.id, { activo: !detalle.activo }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: 'Estado cambiado' });
        this.cargarMotivos();
      }
    });
  }

  // Gestión de Motivos Baja Usuario
  guardarMotivoBaja(m: any) {
    const accion = m.id > 0 
      ? this.bajaUsuarioService.actualizarMotivo(m.id, m) 
      : this.bajaUsuarioService.crearMotivo(m);

    accion.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Motivo de baja guardado' });
        this.cargarMotivosBajaUsuario();
      }
    });
  }

  toggleEstadoMotivoBaja(m: MotivoBaja) {
    this.bajaUsuarioService.actualizarMotivo(m.id, { activo: !m.activo }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: 'Estado de motivo cambiado' });
        this.cargarMotivosBajaUsuario();
      }
    });
  }
}