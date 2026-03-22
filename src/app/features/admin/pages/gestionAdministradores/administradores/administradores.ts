import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TabsModule, Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

// Importar servicios y modelos necesarios para la gestión
import { GestionAdmin } from '../../../../../services/Admin/gestion-admin';
import { AdminCrear, AdminPass, AdminUser } from '../../../../../api/models/Admin/gestionAdmin';
import { MotivoBaja } from '../../../../../api/models/Bajas/BajaUsuario';
import { BajaUsuario } from '../../../../../services/Baja/baja-usuario';

// Importar componentes hijos 
import { AdminTabla } from "./admin-tabla/admin-tabla";
import { AdminDialogBaja } from './admin-dialog-baja/admin-dialog-baja';
import { AdminDialogCrear } from './admin-dialog-crear/admin-dialog-crear';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [
    CommonModule, ToastModule, TabsModule, Tabs, TabList, Tab, TabPanels, TabPanel,
    AdminTabla, AdminDialogBaja, AdminDialogCrear
  ],
  providers: [MessageService],
  templateUrl: './administradores.html'
})
export class Administradores implements OnInit {
  // Definir índice activo para la navegación por pestañas
  activeIndex: number = 3; 
  
  // Declarar variables para el almacenamiento y control de carga de datos
  admins: AdminUser[] = [];
  totalAdmins: number = 0;
  rows: number = 10;
  loadingStaff: boolean = false;
  loadingAccion: boolean = false;
  motivos: MotivoBaja[] = [];

  // Controlar la visibilidad de los diálogos emergentes
  verDialogCrear: boolean = false;
  verDialogBaja: boolean = false;
  
  // Almacenar datos temporales para operaciones de edición o baja
  selectedAdmin?: number;
  resetData: AdminPass | null = null;
//injeccion servicios
private gestionAdminService=inject(GestionAdmin);
  private messageService=inject(MessageService);
    private bajaService=inject( BajaUsuario);
 

  ngOnInit() {
    // Inicializar la carga de motivos de baja y listado de administradores
    this.cargarMotivos();
    this.cargarStaff();
  }

  // Solicitar el listado de personal administrativo al servidor con paginación
  cargarStaff(event?: any) {
    this.loadingStaff = true;
    const page = event ? (event.first / event.rows) : 0;
    this.rows = event ? event.rows : 10;

    this.gestionAdminService.getListadoStaff(page, this.rows).subscribe({
      next: (res) => {
        if (res?.data) {
          this.admins = res.data.data;
          this.totalAdmins = res.data.total;
        }
        this.loadingStaff = false;
      },
      error: (res) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: String(res.error) });
        this.loadingStaff = false;
      }
    });
  }

  // Procesar la creación de un nuevo administrador y capturar la contraseña temporal
  confirmarCrearAdmin(datos: AdminCrear) {
    this.gestionAdminService.crearAdmin(datos).subscribe({
      next: (res) => {
        if (res.data) {
          this.resetData = res.data; 
          this.cargarStaff();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String(res.message) });
        }
      }
    });
  }

  // Solicitar el reseteo de contraseña y mostrar la nueva clave en el diálogo
  resetearPasswordStaff(id: number) {
    this.gestionAdminService.resetPasswordAdmin(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.resetData = res.data;
          this.verDialogCrear = true; 
        }
      }
    });
  }

  // Preparar y mostrar el diálogo de confirmación para dar de baja
  abrirDialogoBaja(id: number) {
    this.selectedAdmin = id;
    this.verDialogBaja = true;
  }

  // Ejecutar la baja forzosa del administrador con el motivo seleccionado
  confirmarBajaForzosa(bajaData: any) {
    if (!this.selectedAdmin) return;
    this.loadingAccion = true;
    this.bajaService.bajaForzosaAdmin(this.selectedAdmin, bajaData).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'info', summary: 'Baja Procesada', detail: String(res.message) });
        this.verDialogBaja = false;
        this.cargarStaff();
        this.loadingAccion = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar la baja' });
        this.loadingAccion = false;
      }
    });
  }

  // Restaurar el acceso de un administrador previamente inhabilitado
  reactivarAdmin(id: number) {
    this.bajaService.reactivarUsuario(id).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario reactivado' });
        this.cargarStaff();
      }
    });
  }

  // Copiar la contraseña temporal al portapapeles y resetear estados de diálogos
  copiarPassword(pass: string) {
    navigator.clipboard.writeText(pass);
    this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Contraseña en el portapapeles' });
    this.verDialogCrear = false;
    this.resetData = null; 
  }

  // Obtener del servidor el catálogo de motivos para realizar bajas
  cargarMotivos() {
    this.bajaService.getMotivos().subscribe(res => this.motivos = res.data ?? []);
  }
}