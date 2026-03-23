import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioPendiente } from '../../../../../api/models/Admin/adminModel';
import { AdminService } from '../../../../../services/Admin/AdminService';


// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-validaciones',
  standalone: true,
  imports: [CommonModule, TableModule,DialogModule, ButtonModule,ConfirmDialogModule, ToastModule, TooltipModule, TagModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './validaciones.html',
  styleUrl: './validaciones.css',
})
export class Validaciones {
  usuarios: UsuarioPendiente[] = [];
  cargando: boolean = true;
  // variables paginacion
  totalRecords: number = 0;
  rows: number = 10;
  lastEvent: any; 

  // Control del flujo de rechazo para el mail
  showRechazoDialog: boolean = false;
  usuarioEnProceso: UsuarioPendiente | null = null;
  constructor(private adminService: AdminService, private messageService: MessageService,private confirmationService:ConfirmationService) {}

 
obtenerPendientes(page: number = 0, rows: number = 10, search: string = ''): void {
    this.cargando = true;
    this.adminService.getUsuariosPendientes(page, rows, search).subscribe({
      next: (res) => {
        if (res.data) {
          this.usuarios = res.data.data; // Array de usuarios
          this.totalRecords = res.data.total; // Total de la DB
        }
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.showToast('error', 'Error', String(err.error.message)|| 'No se pudo cargar la lista');
      },
    });
  }

  // Se dispara cada vez que cambias de página o filtras
  onLazyLoad(event: any): void {
    this.lastEvent = event;
    const page = event.first / event.rows;
    const search = event.globalFilter || '';
    this.obtenerPendientes(page, event.rows, search);
  }

validar(user: UsuarioPendiente): void {
    this.adminService.validarUsuario(user.id).subscribe({
      next: (res) => {
        const mensajeAMostrar = typeof res.message === 'string' ? res.message : String(res.message) || 'Operación realizada con éxito';
        this.showToast('success', 'Éxito', mensajeAMostrar);     
        this.adminService.getPendientesCount().subscribe();
        this.refrescarTabla(); // Refrescar con los filtros actuales
      },
      error: (err) => this.showToast('error', 'Error', String(err.error.message)|| 'Fallo al validar usuario'),
    });
  }
  private refrescarTabla() {
    if (this.lastEvent) {
      this.onLazyLoad(this.lastEvent);
    }
  }
prepararRechazo(usuario: UsuarioPendiente): void {
    this.usuarioEnProceso = usuario;
    this.showRechazoDialog = true;
  }

  // Lanzar el mail (Botón  diálogo)
  redactarEmail(): void {
    if (!this.usuarioEnProceso) return;

    const asunto = encodeURIComponent('Registro en Bolsa de Empleo CIP Burlada');
    const cuerpo = encodeURIComponent(
      `Hola ${this.usuarioEnProceso.name},\n\n` +
      `Tu solicitud de registro ha sido denegada por el siguiente motivo:\n\n` +
      `[ESCRIBIR MOTIVO AQUÍ]\n\n` +
      `Si crees que se trata de un error, ponte en contacto con nosotros.\n\n` +
      `Saludos,\nCI Formación Profesional Burlada.`
    );

    window.location.href = `mailto:${this.usuarioEnProceso.email}?subject=${asunto}&body=${cuerpo}`;
  }

  //  Confirmar eliminación (Botón 2 del diálogo)
  confirmarEliminacion(): void {
    if (!this.usuarioEnProceso) return;

    this.confirmationService.confirm({
      header: 'Confirmar Eliminación',
      message: `¿Has enviado el correo a ${this.usuarioEnProceso.email}? Si confirmas, el usuario será eliminado definitivamente.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.ejecutarDenegacion(),
    });
  }

  private ejecutarDenegacion(): void {
    if (!this.usuarioEnProceso) return;

    this.adminService.rechazarUsuario(this.usuarioEnProceso.id).subscribe({
      next: (res) => {
        this.showToast('info', 'Eliminado', String(res.message)|| 'Usuario rechazado correctamente');
        this.showRechazoDialog = false;
        this.adminService.getPendientesCount().subscribe();
        this.refrescarTabla();
      },
      error: (err) => this.showToast('error', 'Error', String(err.error.message)|| 'No se pudo eliminar el registro'),
    });
  }


copiarAlPortapapeles(texto: string): void {
  navigator.clipboard.writeText(texto).then(() => {
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Copiado', 
      detail: 'Texto listo para pegar' 
    });
  });
}

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
