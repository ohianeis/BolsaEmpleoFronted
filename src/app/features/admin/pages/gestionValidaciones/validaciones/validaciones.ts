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


@Component({
  selector: 'app-validaciones',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,ConfirmDialogModule, ToastModule, TooltipModule, TagModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './validaciones.html',
  styleUrl: './validaciones.css',
})
export class Validaciones implements OnInit {
  usuarios: UsuarioPendiente[] = [];
  cargando: boolean = true;

  constructor(private adminService: AdminService, private messageService: MessageService,private confirmationService:ConfirmationService) {}

  ngOnInit(): void {
    this.obtenerPendientes();
  }

  obtenerPendientes(): void {
    this.cargando = true;
    this.adminService.getUsuariosPendientes().subscribe({
      next: (res) => {
        this.usuarios = res.data ?? [];
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.showToast('error', 'Error', 'No se pudo cargar la lista');
      },
    });
  }

  validar(user: UsuarioPendiente): void {
    this.adminService.validarUsuario(user.id).subscribe({
      next: (res) => {
const mensajeAMostrar = typeof res.message === 'string' ? res.message : 'Operación realizada con éxito';
this.showToast('success', 'Éxito', mensajeAMostrar);     
  this.obtenerPendientes(); // Refrescar tabla
      },
      error: (err) => this.showToast('error', 'Error', 'Fallo al validar usuario'),
    });
  }
rechazarUsuario(usuario: any) {
    const email = usuario.email;
    const nombre = usuario.name;
    const asunto = encodeURIComponent('Registro en Bolsa de Empleo CIP Burlada');
const cuerpo = encodeURIComponent(
  `Hola ${nombre},\n\n` +
  `Sentimos comunicarte que tu solicitud de registro en la Bolsa de Empleo del CIP Burlada ha sido denegada por el siguiente motivo:\n\n` +
  `[ESCRIBIR MOTIVO AQUÍ]\n\n` +
  `Si crees que se trata de un error, puedes ponerte en contacto con nosotros respondiendo a este correo.\n\n` +
  `Saludos,\n` +
  `CI Formación Profesional Burlada.`
);
    // 1. Intentamos abrir el correo
    window.location.href = `mailto:${email}?subject=${asunto}&body=${cuerpo}`;

    // 2. Usamos el servicio de PrimeNG en lugar del alert "rudo"
setTimeout(() => {
    this.confirmationService.confirm({
      header: 'Confirmar Eliminación',
      message: `¿Has enviado el correo a ${email}? Si confirmas, el usuario será eliminado definitivamente.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-rounded',
      rejectButtonStyleClass: 'p-button-secondary p-button-rounded p-button-text',
      accept: () => {
        this.denegar(usuario);
      },
      reject: () => {
        this.showToast('info', 'Cancelado', 'El usuario sigue en la lista');
      }
    });
  }, 300); //
  }

  denegar(user: UsuarioPendiente): void {
    this.adminService.rechazarUsuario(user.id).subscribe({
      next: (res) => {
        const mensajeAMostrar = typeof res.message === 'string' ? res.message : 'Operación realizada con éxito';

        this.showToast('info', 'Eliminado', mensajeAMostrar);
        this.obtenerPendientes(); // Refrescar tabla
      },
      error: (err) => this.showToast('error', 'Error', 'No se pudo eliminar el registro'),
    });
  }

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
