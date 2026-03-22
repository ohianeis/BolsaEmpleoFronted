import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG: Importamos el Módulo Y los componentes para el inyector
import { TabsModule, Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip'; // Añadido para los iconos

import { GestionAdmin } from '../../../../../services/Admin/gestion-admin';
import { AdminUser } from '../../../../../api/models/Admin/gestionAdmin';
import { MotivoBaja } from '../../../../../api/models/Bajas/BajaUsuario';
import { BajaUsuario } from '../../../../../services/Baja/baja-usuario';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    // Componentes de Tabs para evitar error NG0201
    TabsModule, Tabs, TabList, Tab, TabPanels, TabPanel,
    TableModule, 
    SelectModule,
    ButtonModule, 
    InputTextModule, 
    ToastModule, 
    DialogModule, 
    DrawerModule, 
    TagModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './administradores.html',
  styleUrl: './administradores.css',
})
export class Administradores implements OnInit {
  activeIndex: number = 0;
  
 // Variables de datos
  staff: AdminUser[] = [];
  loadingStaff: boolean = false;
  
  // Variables de Paginación (Nuevas/Ajustadas)
  totalStaff: number = 0; // Total de registros en la DB
  rows: number = 10;      // Registros por página
  first: number = 0;     // Índice del primer registro (para PrimeNG)

  showCreateStaffDialog: boolean = false;
  showResetPassDialog: boolean = false;
  
  nuevoAdmin = { name: '', email: '' };
  resetData?: { pass_temporal: string };
  // --- NUEVAS VARIABLES PARA bajas ---
  motivos: MotivoBaja[] = [];
  showBajaDialog: boolean = false;
  selectedStaffId?: number;
  bajaData = { motivo_baja_id: null as any, comentario_baja: '' };
  loadingAccion: boolean = false;
 constructor(
    private gestionAdminService: GestionAdmin,
    private messageService: MessageService,
    private bajaService:BajaUsuario
  ) {}

  ngOnInit() {
  // Forzamos que empiece en el tab 3 y cargue la data
  this.activeIndex = 3; 
  this.cargarMotivos();
}

  onTabChange(event: any) {
    this.activeIndex = event;
    if (this.activeIndex === 3) {
      this.cargarStaff();
    }
  }

cargarStaff(event?: any) {
  this.loadingStaff = true;

  // Calculamos página para Laravel
  const page = event ? (event.first / event.rows) : 0;
  this.rows = event ? event.rows : 10;

  this.gestionAdminService.getListadoStaff(page, this.rows).subscribe({
    next: (res: any) => {
      // res es el objeto raíz { message: "...", data: {...} }
      if (res && res.data) {
        // ACCESO CORRECTO SEGÚN TU CONSOLE:
        this.staff = res.data.data;       // Aquí está el Array [{...}]
        this.totalStaff = res.data.total; // Aquí está el número 1
        
        if (event) this.first = event.first;
      }
      this.loadingStaff = false;
      console.log('Usuarios asignados a la tabla:', this.staff);
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el staff' });
      this.loadingStaff = false;
    }
  });
}
  confirmarCrearAdmin() {
    this.gestionAdminService.crearAdmin(this.nuevoAdmin).subscribe({
      next: (res) => {
        if (res.data) {
          this.resetData = res.data;
          this.showCreateStaffDialog = false;
          this.showResetPassDialog = true; 
          this.cargarStaff();
          this.nuevoAdmin = { name: '', email: '' };
        }
      }
    });
  }

  resetearPasswordStaff(id: number) {
    this.gestionAdminService.resetPasswordAdmin(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.resetData = res.data;
          this.showResetPassDialog = true;
        }
      }
    });
  }

  copiarPassword(pass: string) {
    if (pass) {
      navigator.clipboard.writeText(pass);
      this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Contraseña en el portapapeles' });
      this.showResetPassDialog = false;
    }
  }
 cargarMotivos() {
  this.bajaService.getMotivos().subscribe({
    next: (res) => {
      // Usamos el operador de coalescencia nula (??)
      // Si res.data es null/undefined, asigna []
      this.motivos = res.data ?? [];
    },
    error: (err) => {
      this.motivos = []; // También inicializamos en caso de error
      console.error(err);
    }
  });
}

  // --- MÉTODO PARA REACTIVAR ---
  reactivarAdmin(id: number) {
    this.loadingAccion = true;
    this.bajaService.reactivarUsuario(id).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String(res.message) });
        this.cargarStaff(); // Refrescar tabla
        this.loadingAccion = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo reactivar' });
        this.loadingAccion = false;
      }
    });
  }

  // --- MÉTODOS PARA BAJA FORZOSA ---
  abrirDialogoBaja(id: number) {
    this.selectedStaffId = id;
    this.bajaData = { motivo_baja_id: null, comentario_baja: '' };
    this.showBajaDialog = true;
  }

  confirmarBajaForzosa() {
    if (!this.selectedStaffId || !this.bajaData.motivo_baja_id) {
        this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes seleccionar un motivo' });
        return;
    }

    this.loadingAccion = true;
    this.bajaService.bajaForzosaAdmin(this.selectedStaffId, this.bajaData).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'info', summary: 'Baja Procesada', detail: String(res.message) });
        this.showBajaDialog = false;
        this.cargarStaff(); // Refrescar tabla
        this.loadingAccion = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar la baja' });
        this.loadingAccion = false;
      }
    });
  }
}