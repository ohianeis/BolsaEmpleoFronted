import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

// Servicios / Modelos
import { MotivoBaja } from '../../../../../../api/models/Bajas/BajaUsuario';
import { ReseatPass } from '../../../../../../services/ReseatPass/reseat-pass';
import { BajaUsuario } from '../../../../../../services/Baja/baja-usuario';
import { AdminService } from '../../../../../../services/Admin/AdminService';
import { AlumnoExpediente } from '../../../../../../api/models/Admin/adminModel';
import { DetalleUsuario } from '../detalle-usuario/detalle-usuario';

@Component({
  selector: 'app-tabla-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    DrawerModule,
    DialogModule,
    SelectModule,
    TextareaModule,
    TagModule,
    DetalleUsuario
  ],
  templateUrl: './tabla-alumnos.html',
})
export class TablaAlumnos {
  private adminService = inject(AdminService);
  private bajaService = inject(BajaUsuario);
  private reseatService = inject(ReseatPass);
  private messageService = inject(MessageService);

  @ViewChild('dtAlumnos') dtAlumnos?: Table;

  alumnos: any[] = [];
  totalRecords = 0;
  loading = false;

  // Detalle y Modales
  selectedAlumno: any = null;
  visibleAlumnoDrawer = false;
  showBajaDialog = false;
  motivosBaja: MotivoBaja[] = [];
  selectedMotivoBaja: any = null;
  comentarioBaja = '';

  // Password
  showResetPassDialog = false;
  passTemporal = '';
// Variable para guardar el texto de búsqueda actual
private searchTimeout: any;
private searchText: string = '';

  constructor() {
    this.cargarMotivos();
  }

 onSearch(event: any) {
    const value = event.target.value;

    // 1. Limpiamos el contador del último tecleo
    if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
    }

    // 2. Solo disparamos la búsqueda si el texto ha cambiado realmente
    // y después de que el usuario pare de escribir 500ms
    this.searchTimeout = setTimeout(() => {
        if (this.searchText !== value) {
            this.searchText = value;
            this.dtAlumnos?.reset(); // Esto activa el onLazyLoad
        }
    }, 500); 
}

onLazyLoad(event: any) {
  this.loading = true;

  // Calculamos la página
  const page = (event.first / event.rows) ; // +1 si tu API empieza en 1
  const rows = event.rows;

  // IMPORTANTE: Aquí pasamos 'this.searchText' que viene del input
  this.adminService.getAllAlumnos(page, rows, this.searchText).subscribe({
    next: (res) => {
      this.totalRecords = res.data?.total || 0;
      this.alumnos = res.data?.data || [];
      this.loading = false;
    },
    error: () => this.loading = false,
  });
}

  verDetalle(alumno: AlumnoExpediente) {
    this.adminService.getDetalleAlumno(alumno.id).subscribe((res) => {
      this.selectedAlumno = res.data;
      this.visibleAlumnoDrawer = true;
    });
  }

  resetearPassword(userId: number) {
    this.reseatService.resetPasswordAdmin(userId).subscribe((res) => {
      this.passTemporal = res?.data?.pass_temporal ?? '';
      this.showResetPassDialog = true;
    });
  }

  copiarPassword(pass: string) {
    navigator.clipboard.writeText(pass);
    this.showResetPassDialog = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Copiado',
      detail: 'Contraseña en portapapeles',
    });
  }

  cargarMotivos() {
    this.bajaService.getMotivos().subscribe((res) => (this.motivosBaja = res.data ?? []));
  }

abrirDialogoBaja(alumno?: any) {
    if (alumno) {
      this.selectedAlumno = alumno; 
    }
    this.showBajaDialog = true;
  }

 confirmarBaja() {
    if (!this.selectedMotivoBaja || !this.selectedAlumno) return;
    
    const payload = {
      motivo_baja_id: this.selectedMotivoBaja.id,
      comentario_baja: this.comentarioBaja,
    };

    // Usamos el user_id del alumno seleccionado
    this.bajaService.bajaForzosaAdmin(this.selectedAlumno.user_id, payload).subscribe(() => {
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Baja confirmada',
        detail: `El usuario ${this.selectedAlumno.nombre} ha sido dado de baja.` 
      });
      
      this.showBajaDialog = false;
      this.visibleAlumnoDrawer = false;
      this.selectedMotivoBaja = null; // Limpiamos para la próxima
      this.comentarioBaja = '';
      this.dtAlumnos?.reset(); // Recargamos la tabla
    });
  }
}
