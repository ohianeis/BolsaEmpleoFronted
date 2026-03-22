import { Component, OnInit, Input, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs'; 
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import {  ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { AdminService } from '../../../../../services/Admin/AdminService';
import { FormsModule } from '@angular/forms';

import { Select, SelectModule } from 'primeng/select';
import { BajaUsuario } from '../../../../../services/Baja/baja-usuario';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MotivoBaja, userBaja } from '../../../../../api/models/Bajas/BajaUsuario';
import { ResetPassAdminData } from '../../../../../api/models/ReseatPass/reseatPass';
import { ReseatPass } from '../../../../../services/ReseatPass/reseat-pass';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule, 
    TabsModule,
    TableModule, 
    ToastModule,
    TagModule, 
    DrawerModule,
    DialogModule,
    TextareaModule,
    SelectModule,
    ButtonModule, 
    FormsModule,
    Select,
    SkeletonModule
  ],
  providers:[MessageService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  @Input() tab?: string;
// --- REFERENCIAS A TABLAS (Para limpiar filtros) ---
  @ViewChild('dtAlumnos') dtAlumnos?: Table;
  @ViewChild('dtEmpresas') dtEmpresas?: Table;
   @ViewChild('dtBajas') dtBajas?: Table;
  activeIndex: number = 0;
  alumnos: any[] = [];
  empresas: any[] = [];
  loadingAlumnos: boolean = false;
  loadingEmpresas: boolean = false;

  selectedAlumno: any = null;
visibleAlumnoDrawer: boolean = false;

selectedEmpresa: any = null;
visibleEmpresaDrawer: boolean = false;
//variables baja usuario
motivosBaja: MotivoBaja[] = [];
selectedMotivoBaja: any = null;
  comentarioBaja: string = '';
  showBajaDialog: boolean = false;
  usuarioADarDeBaja: any = null;
  //variables para paginacion
  totalAlumnos=0;
  totalEmpresas=0;
  totalBajas=0;
  rows=10;
  private bajaService=inject(BajaUsuario);
  usuariosBaja: any[] = [];//meter usuarios que estan de baja
loadingBajas: boolean = false;
visibleHistorialDrawer: boolean = false;
selectedUsuarioBaja: userBaja|null = null;
titulosDisponibles: any[] = [];

//variables para resetear password

showResetPassDialog: boolean = false;
resetData?: ResetPassAdminData;
loadingReset: boolean = false;
reseatService=inject(ReseatPass)
  constructor(private adminService: AdminService, private messageService:MessageService) {}

  ngOnInit(): void {
    // Si la URL dice ?tab=empresas, activamos el índice 1
    this.activeIndex = this.tab === 'empresas' ? 1 : 0;
   
    this.getTitulosFiltro();
    this.cargarMotivos();
  }

  // para PrimeNG v18: recibe el string del value directamente
onTabChange(value: any): void {
    // Convertimos a número porque p-tabs puede devolver string o number
    const index = Number(value);
    if (isNaN(index)) return;

    this.activeIndex = index;

    // 1. Limpiamos filtros visuales de las tablas
    if (index === 0 && this.dtAlumnos) this.dtAlumnos.reset();
    if (index === 1 && this.dtEmpresas) this.dtEmpresas.reset();

    // 2. IMPORTANTE: No vacíes los arrays aquí si usas [lazy]="true"
    // El componente p-table con lazy loading disparará (onLazyLoad) 
    // automáticamente si detecta un cambio de visibilidad o reset.
    
    this.cargarData(index);
}
  refreshAll(): void {
    // Resetear filtros visuales
    if (this.dtAlumnos) this.dtAlumnos.reset();
    if (this.dtEmpresas) this.dtEmpresas.reset();

    // Vaciar arrays para forzar skeletons
    this.alumnos = [];
    this.empresas = [];
    this.usuariosBaja = [];
    
    this.cargarData(this.activeIndex);
    this.messageService.add({ severity: 'info', summary: 'Sincronizando', detail: 'Datos actualizados' });
  }
getTitulosFiltro(): void {
  this.adminService.getTitulos().subscribe({
    next: (res) => {
      if (res && res.data) {
        this.titulosDisponibles = res.data.map((t: any) => ({
          label: t.titulo.toUpperCase(), // Usamos 'titulo' que es lo que viene en tu JSON
          value: t.titulo               // Valor para filtrar
        }));
      }
    }
  });
}
private mostrarError(mensaje: string,tipoResultado:string) {
    this.messageService.add({
      severity: 'error',
      summary: tipoResultado,
      detail: mensaje,
      life: 5000
    });
  }
cargarData(index: number): void {
  switch(index) {
    case 0: 
      this.alumnos = [];
      // Intentamos pillar el filtro si la tabla ya existe
      this.getAlumnos(0, this.rows, this.dtAlumnos?.el.nativeElement.querySelector('input')?.value || ''); 
      break;
    case 1: 
      this.empresas = [];
      this.getEmpresas(0, this.rows, this.dtEmpresas?.el.nativeElement.querySelector('input')?.value || ''); 
      break;
    case 2: 
      this.usuariosBaja = [];
    this.getHistorialBajas(0,this.rows,this.dtBajas?.el.nativeElement.querySelector('input')?.value||'');
      break;
  }
}
getHistorialBajas(page: number = 0, rows: number = 10, search: string = ''): void {
  this.loadingBajas = true;
  // Pasamos 'search' al servicio (tu servicio ya parece estar preparado para recibirlo según el código que pegaste)
  this.bajaService.getHistorialBajas(page, rows, search).subscribe({
    next: (res) => {
      if (res.data) {
        this.totalBajas = res.data.total;
        this.usuariosBaja = res.data.data;
      }
      this.loadingBajas = false;
    },
    error: (err) => {
      this.mostrarError('Error al cargar historial', 'Error');
      this.loadingBajas = false;
    }
  });
}
getAlumnos(page: number = 0, rows: number = 10, search: string = ''): void {
  this.loadingAlumnos = true;
  this.adminService.getAllAlumnos(page, rows, search).subscribe({
    next: (res) => {
      const dataArray = res.data?.data || []; 
      this.totalAlumnos = res.data?.total || 0;

      this.alumnos = dataArray.map((alumno: any) => {
        const titulosStr = alumno.titulos ? alumno.titulos.map((t: any) => t.nombre).join(', ') : '';
        return {
          ...alumno,
          titulosParaMostrar: titulosStr
        };
      });
      this.loadingAlumnos = false;
    },
    error: (err) => {
      this.loadingAlumnos = false;
      this.mostrarError('Error al cargar alumnos', err.error);
    }
  });
}
getEmpresas(page: number = 0, rows: number = 10, search: string = ''): void {
  this.loadingEmpresas = true;
  // Ahora pasamos 'search' como tercer argumento
  this.adminService.getAllEmpresas(page, rows, search).subscribe({
    next: (res) => {
      if (res.data) {
        this.totalEmpresas = res.data.total;
        this.empresas = res.data.data;
      }
      this.loadingEmpresas = false;
    },
    error: (err) => {
      this.mostrarError(err.error?.message || 'Error al obtener empresas', 'Error');
      this.loadingEmpresas = false;
    }
  });
}

  // Métodos de utilidad para el HTML
  getValidadoSeverity(validado: number): "success" | "warn" | "danger" | "secondary" | "info" {
    return validado === 1 ? 'success' : 'warn';
  }

  getValidadoLabel(validado: number): string {
    return validado === 1 ? 'VALIDADO' : 'PENDIENTE';
  }

 verDetalleAlumno(alumno: any) {
  
  this.visibleAlumnoDrawer = false; 
  this.selectedAlumno = null;

  this.adminService.getDetalleAlumno(alumno.id).subscribe({
    next: (res) => {
      this.selectedAlumno = res.data;
      // 2. Usamos un pequeño delay o simplemente asignamos
      // Esto asegura que Angular detecte el cambio de datos y luego abra el panel
      setTimeout(() => {
        this.visibleAlumnoDrawer = true;
      }, 50);
    },
    error: (err) => console.error('Error al cargar detalle del alumno', err)
  });
}

// MÉTODO PARA EMPRESAS
verDetalleEmpresa(empresa: any) {
  this.selectedEmpresa = null;
  this.adminService.getDetalleEmpresa(empresa.id).subscribe({
    next: (res) => {
      this.selectedEmpresa = res.data;
      this.visibleEmpresaDrawer = true;
    },
    error: (err) => console.error('Error al cargar detalle de empresa', err)
  });
}
//cambio de paginas paginado
onLazyLoadAlumnos(event: any) {
    const page = event.first / event.rows;
    const filtro= event.globalFilter || ''; 
    this.getAlumnos(page, event.rows, filtro);
   
}

onLazyLoadEmpresas(event: any) {
    const page = event.first / event.rows;
    const filtro = event.globalFilter || ''; 
    this.getEmpresas(page, event.rows, filtro);
}

onLazyLoadBajas(event: any) {
    const page = event.first / event.rows;
    const filtro = event.globalFilter || ''; // Capturamos el filtro
    this.getHistorialBajas(page, event.rows, filtro);
}
// En usuarios.ts

// Esta función permite que p-table sepa cómo filtrar dentro del array de títulos
customFilterTítulos(value: string[], filter: string): boolean {
  if (!filter) return true;
  return value.some(t => t.toLowerCase().includes(filter.toLowerCase()));
}

//baja de un usuario, motivos
cargarMotivos() {
    this.bajaService.getMotivos().subscribe({
      next: (res) => this.motivosBaja = res.data ?? [],
      error: (err) => console.error('Error al cargar motivos', err)
    });
  }

  // Prepara el proceso de baja
  abrirDialogoBaja(usuario: any) {
    this.usuarioADarDeBaja = usuario;
    this.showBajaDialog = true;
  }

confirmarBajaAdmin() {
    if (!this.selectedMotivoBaja) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un motivo' });
      return;
    }

    const payload = {
      motivo_baja_id: this.selectedMotivoBaja.id, // Asegúrate que el objeto del combo tenga .id
      comentario_baja: this.comentarioBaja
    };

    // Usamos el ID de usuario (user_id)
    this.bajaService.bajaForzosaAdmin(this.usuarioADarDeBaja.user_id, payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Usuario Desactivado', detail: String(res.message) });
        
        // --- LIMPIEZA ---
        this.showBajaDialog = false;
        this.visibleAlumnoDrawer = false;
        this.visibleEmpresaDrawer = false;
        this.selectedMotivoBaja = null;
        this.comentarioBaja = '';     
        
        // Resetear arrays para forzar la recarga en cargarData()
        this.alumnos = [];
        this.empresas = [];
        this.cargarData(this.activeIndex); 
      },
      error: (err) => {
          this.mostrarError(err.error?.message || 'No se pudo procesar la baja', 'Error');
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
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String(res.message) });
      this.visibleHistorialDrawer = false;
      
      // Refrescamos las listas
      this.usuariosBaja = [];
      this.alumnos = [];
      this.empresas = [];
      this.cargarData(this.activeIndex);
    },
    error: (err) => this.mostrarError('No se pudo reactivar al usuario', 'Error')
  });
}
resetearPassword(idUsuario: number) {
    this.loadingReset = true;
    this.reseatService.resetPasswordAdmin(idUsuario).subscribe({
        next: (res) => {
            this.resetData = res.data;
            this.showResetPassDialog = true;
            this.loadingReset = false;
            this.showResetPassDialog=true;
            this.messageService.add({ 
                severity: 'success', 
                summary: 'Contraseña Reseteada', 
                detail: 'Se ha generado una clave temporal' 
            });
        },
        error: (err) => {
            this.loadingReset = false;
            this.mostrarError('No se pudo resetear la contraseña', 'Error');
        }
    });
}

// Método extra para copiar al portapapeles

// Método extra para copiar al portapapeles
copiarPassword(password:string) {
    if (this.resetData?.pass_temporal) {
        navigator.clipboard.writeText(this.resetData.pass_temporal);
        this.showResetPassDialog=false;
        this.messageService.add({ severity: 'info', summary: 'Copiado', detail: 'Contraseña en el portapapeles' });
    }
}

}