import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';

// PrimeNG y componentes personalizados
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Familia, TituloAdmin, TituloRequest } from '../../../../../api/models/Admin/adminModel';
import { Nivel } from '../../../../../services/Titulos/titulos';
import { AdminService } from '../../../../../services/Admin/AdminService';
import { CierreOferta } from '../../../../../services/MotivosCierreOferta/cierre-oferta';
import {
  DetalleMotivo,
  Motivo,
} from '../../../../../api/models/MotivoCierreOferta/motivoCierreResponse';
import { MotivoBaja } from '../../../../../api/models/Bajas/BajaUsuario';
import { BajaUsuario } from '../../../../../services/Baja/baja-usuario';

// Importación de componentes de configuración especializados
import { ConfigTitulos } from '../components/config-titulos/config-titulos';
import { ConfigFamilias } from '../components/config-familias/config-familias';
import { ConfigMotivosBaja } from '../components/config-motivos-baja/config-motivos-baja';
import { ConfigMotivosCierre } from '../components/config-motivos-cierre/config-motivos-cierre';
import { stringify } from 'querystring';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ConfigTitulos,
    ConfigFamilias,
    ConfigMotivosBaja,
    ConfigMotivosCierre,
  ],
  providers: [MessageService],
  templateUrl: './config.html',
  styleUrl: './config.css',
})
export class Config implements OnInit {
  // Definir colecciones de datos para alimentar los componentes hijos
  titulos: TituloAdmin[] = [];
  niveles: Nivel[] = [];
  familias: Familia[] = [];
  detalles: DetalleMotivo[] = [];
  motivosBajaUsuario: MotivoBaja[] = [];
  cargando: boolean = true;

  // Inyectar servicios de administración y mensajería
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);
  private detalleMotivosService = inject(CierreOferta);
  private bajaUsuarioService = inject(BajaUsuario);

  ngOnInit() {
    // Ejecutar la carga inicial de todas las configuraciones del sistema
    this.cargarDatos();
    this.cargarNiveles();
    this.cargarFamilias();
    this.cargarMotivos();
    this.cargarMotivosBajaUsuario();
  }

  // --- MÉTODOS DE CARGA DE DATOS ---

  // Obtener el listado de títulos académicos desde el servidor
  cargarDatos() {
    this.cargando = true;
    this.adminService.getTitulos().subscribe({
      next: (res) => {
        this.titulos = res.data ?? [];
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
  }

  // Solicitar las familias profesionales activas
  cargarFamilias() {
    this.adminService.getFamilias().subscribe({
      next: (res) => (this.familias = res.data ?? []),
    });
  }

  // Obtener los motivos de cierre de oferta, filtrando por la categoría específica
  cargarMotivos() {
    this.detalleMotivosService.getConfiguracionAdmin().subscribe({
      next: (res) => {
        const motivoNoAsignacion = res.data?.find((m) => m.id === 2);
        this.detalles = motivoNoAsignacion?.detalles ? [...motivoNoAsignacion.detalles] : [];
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // Cargar el catálogo de motivos para la baja de usuarios
  cargarMotivosBajaUsuario() {
    this.bajaUsuarioService.getMotivos().subscribe({
      next: (res) => (this.motivosBajaUsuario = res.data ?? []),
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // Obtener los niveles formativos disponibles (Grado Medio, Superior, etc.)
  cargarNiveles() {
    this.adminService.getNiveles().subscribe({
      next: (res) => (this.niveles = res.data ?? []),
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // --- MÉTODOS DE ACCIÓN PARA TÍTULOS ---

  // Procesar la creación o actualización de un título académico
  guardarTitulo(datos: any) {
    const request: TituloRequest = {
      nombre: datos.nombre,
      nivel: datos.nivel,
      familia: datos.familia,
      centro: 1,
    };

    if (datos.id > 0) {
      this.adminService.actualizarTitulo(datos.id, request).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: String(res.message),
          });
          this.cargarDatos();
        },
        error: (err) => this.mostrarErrorValidacion(err),
      });
    } else {
      this.adminService.crearTitulo(request).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: String(res.message),
          });
          this.cargarDatos();
        },
        error: (err) => this.mostrarErrorValidacion(err),
      });
    }
  }

  // Gestionar el error de validación 422 y mostrar detalles al usuario
  private mostrarErrorValidacion(err: any) {
    const detalle = err.error?.errors
      ? Object.values(err.error.errors).flat().join(', ')
      : err.error?.message || 'Error de validación';

    this.messageService.add({
      severity: 'error',
      summary: 'Error en los datos',
      detail: detalle,
      sticky: true,
    });
  }

  // Desactivar un título del sistema mediante su identificador
  borrarTitulo(id: number) {
    this.adminService.eliminarTitulo(id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Eliminado',
          detail: String(res.message),
        });
        this.cargarDatos();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // Reinstaurar un título inactivo recuperando sus referencias de nivel y familia
  reactivarTitulo(t: TituloAdmin) {
    const nivelEncontrado = this.niveles.find((n) => n.nivel === t.nivel);
    const familiaEncontrada = this.familias.find((f) => f.nombre === t.familia);

    const request = {
      nombre: t.titulo,
      nivel: nivelEncontrado!.id,
      familia: familiaEncontrada!.id,
      centro: 1,
      activado: 1,
    };

    this.adminService.actualizarTitulo(t.id, request).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reactivado',
          detail: String(res.message),
        });
        this.cargarDatos();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // --- MÉTODOS DE ACCIÓN PARA FAMILIAS ---

  // Guardar cambios en una familia profesional o dar de alta una nueva
  guardarFamilia(f: any) {
    const request = { nombre: f.nombre };
    const accion =
      f.id > 0
        ? this.adminService.actualizarFamilia(f.id, request)
        : this.adminService.crearFamilia(request);

    accion.subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: String(res.message),
        });
        this.cargarFamilias();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // Inhabilitar una familia profesional y actualizar el estado de sus títulos vinculados
  borrarFamilia(id: number) {
    this.adminService.eliminarFamilia(id).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: String(res.message) });
        this.cargarFamilias();
        this.cargarDatos();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // Reactivar una familia profesional previamente desactivada
  reactivarFamilia(id: number) {
    this.adminService.actualizarFamilia(id, { activa: true }).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: String(res.message),
        });
        this.cargarFamilias();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // --- MÉTODOS DE ACCIÓN PARA MOTIVOS DE CIERRE Y BAJA ---

  // Registrar o editar un detalle específico para el cierre de ofertas
  guardarDetalleCierre(d: any) {
    const accion =
      d.id > 0
        ? this.detalleMotivosService.actualizarDetalle(d.id, d)
        : this.detalleMotivosService.crearDetalle(d);

    accion.subscribe({
      next: (ress) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: String(ress.message),
        });
        this.cargarMotivos();
      },
    });
  }

  // Alternar el estado de activación de un detalle de cierre
  toggleEstadoDetalle(detalle: DetalleMotivo) {
    this.detalleMotivosService
      .actualizarDetalle(detalle.id, { activo: !detalle.activo })
      .subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', detail: String(res.message) });
          this.cargarMotivos();
        },
        error: (err) => this.mostrarErrorValidacion(err),
      });
  }

  // Crear o actualizar un motivo de baja de usuario en el sistema
  guardarMotivoBaja(m: any) {
    const accion =
      m.id > 0
        ? this.bajaUsuarioService.actualizarMotivo(m.id, m)
        : this.bajaUsuarioService.crearMotivo(m);

    accion.subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: String(res.message),
        });
        this.cargarMotivosBajaUsuario();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }

  // Cambiar la disponibilidad de un motivo de baja (Activo/Inactivo)
  toggleEstadoMotivoBaja(m: MotivoBaja) {
    this.bajaUsuarioService.actualizarMotivo(m.id, { activo: !m.activo }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', detail: String(res.message) });
        this.cargarMotivosBajaUsuario();
      },
      error: (err) => this.mostrarErrorValidacion(err),
    });
  }
}
