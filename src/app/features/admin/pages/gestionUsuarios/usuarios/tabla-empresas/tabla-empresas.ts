import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../../../../../services/Admin/AdminService';
import { ReseatPass } from '../../../../../../services/ReseatPass/reseat-pass';
import { BajaUsuario } from '../../../../../../services/Baja/baja-usuario';
import { MotivoBaja } from '../../../../../../api/models/Bajas/BajaUsuario';
import { Select, SelectModule } from 'primeng/select';

// Servicios

@Component({
  selector: 'app-tabla-empresas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule,
    InputTextModule, DrawerModule, TagModule, TooltipModule, DialogModule,SelectModule
  ],
  templateUrl: './tabla-empresas.html'
})
export class TablaEmpresas {
  private adminService = inject(AdminService);
  private reseatService = inject(ReseatPass);
  private messageService = inject(MessageService);
  private bajaService = inject(BajaUsuario);

  @ViewChild('dtEmpresas') dtEmpresas?: Table;

  // Estados
  empresas: any[] = [];
  totalRecords = 0;
  loading = false;
  
  // Detalle
  selectedEmpresa: any = null;
  visibleDrawer = false;

  // Password
  showResetPassDialog = false;
  passTemporal = '';
  // Estados para la baja
  showBajaDialog = false;
  motivosBaja: MotivoBaja[] = [];
  selectedMotivoBaja: any = null;
  comentarioBaja = '';

  constructor() {
    this.cargarMotivos();
  }
  onLazyLoad(event: any) {
    this.loading = true;
    const page = event.first / event.rows;
    const search = event.globalFilter || '';

    this.adminService.getAllEmpresas(page, event.rows, search).subscribe({
      next: (res) => {
        this.totalRecords = res?.data?.total ?? 0;
        this.empresas = res?.data?.data ?? [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  verDetalle(empresa: any) {
    this.adminService.getDetalleEmpresa(empresa.id).subscribe(res => {
      if (res?.data) {
        this.selectedEmpresa = res.data;
        this.visibleDrawer = true;
      }
    });
  }

  resetearPassword(userId: number) {
        console.log('ID del usuario recibido:', userId); // <--- MIRA LA CONSOLA DEL NAVEGADOR

    this.reseatService.resetPasswordAdmin(userId).subscribe({
      next: (res) => {
        this.passTemporal = res?.data?.pass_temporal ?? '';
        if (this.passTemporal) {
          this.showResetPassDialog = true;
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo resetear la contraseña' });
      }
    });
  }

  copiarPassword(pass: string) {
    navigator.clipboard.writeText(pass);
    this.showResetPassDialog = false;
    this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Contraseña lista para enviar' });
  }
  cargarMotivos() {
    this.bajaService.getMotivos().subscribe((res) => (this.motivosBaja = res.data ?? []));
  }

  abrirDialogoBaja(empresa: any) {
    this.selectedEmpresa = empresa; // Nos aseguramos de tener la empresa
    this.showBajaDialog = true;
  }

  confirmarBaja() {
    if (!this.selectedMotivoBaja || !this.selectedEmpresa) return;

    const payload = {
      motivo_baja_id: this.selectedMotivoBaja.id,
      comentario_baja: this.comentarioBaja,
    };

    // Usamos el user_id de la empresa (asegúrate de que el objeto lo traiga)
    const userId = this.selectedEmpresa.user_id || this.selectedEmpresa.user?.id;

    this.bajaService.bajaForzosaAdmin(userId, payload).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Colaboración Cesada', 
          detail: `La empresa ${this.selectedEmpresa.nombre} ha sido dada de baja.` 
        });
        this.showBajaDialog = false;
        this.visibleDrawer = false;
        this.dtEmpresas?.reset(); // Recargar la tabla
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo procesar la baja' });
      }
    });
  }

}