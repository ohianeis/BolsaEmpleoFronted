import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { UsuarioPendiente } from '../../../../../api/models/Admin/adminModel';
import { AdminService } from '../../../../../services/Admin/AdminService';

@Component({
  selector: 'app-validaciones',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, TooltipModule, TagModule],
  providers: [MessageService],
  templateUrl: './validaciones.html',
  styleUrl: './validaciones.css',
})
export class Validaciones implements OnInit {
  usuarios: UsuarioPendiente[] = [];
  cargando: boolean = true;

  constructor(private adminService: AdminService, private messageService: MessageService) {}

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
