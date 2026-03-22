import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { BajaUsuario } from '../../../../../../services/Baja/baja-usuario';
import { userBaja } from '../../../../../../api/models/Bajas/BajaUsuario';

// Servicios y Modelos (Importados de tus rutas originales)

@Component({
  selector: 'app-historial-bajas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DrawerModule, TagModule],
  templateUrl: './historial-bajas.html'
})
export class HistorialBajas {
  // Cambiamos a bajaService como en tu original
  private bajaService = inject(BajaUsuario);
  private messageService = inject(MessageService);

  @ViewChild('dtBajas') dtBajas?: Table;

  usuariosBaja: any[] = [];
  totalBajas = 0;
  loadingBajas = false;
  
  // Tipado exacto de tu modelo
  selectedUsuarioBaja: userBaja | null = null;
  visibleHistorialDrawer = false;

  onLazyLoad(event: any) {
    this.loadingBajas = true;
    const page = event.first / event.rows;
    const search = event.globalFilter || '';

    // Usamos el servicio de Bajas
    this.bajaService.getHistorialBajas(page, event.rows, search).subscribe({
      next: (res) => {
        this.totalBajas = res?.data?.total ?? 0;
        this.usuariosBaja = res?.data?.data ?? [];
        this.loadingBajas = false;
      },
      error: (err) => {
        this.loadingBajas = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: String(err.message)||'Error al solicitar el listado' });
      }
    });
  }

  verDetalleBaja(usuario: any) {
    this.selectedUsuarioBaja = usuario;
    this.visibleHistorialDrawer = true;
  }

  confirmarReactivacion() {
    if (!this.selectedUsuarioBaja) return;

    this.bajaService.reactivarUsuario(this.selectedUsuarioBaja.id).subscribe({
      next: (res) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: String(res.message || 'Usuario reactivado') 
        });
        this.visibleHistorialDrawer = false;
        this.dtBajas?.reset(); // Esto dispara el onLazyLoad automáticamente
      },
      error: (err) => {
        
        this.messageService.add({ severity: 'error', summary: 'Error', detail: String(err.error.message)||'Error de conexión' });
      }
    });
  }
}