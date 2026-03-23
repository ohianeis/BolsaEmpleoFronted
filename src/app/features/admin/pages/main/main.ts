import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, timer, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// PrimeNG
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

// Componentes Hijos (Asegúrate de que las rutas sean correctas)

// Servicios y Modelos
import { AdminService } from '../../../../services/Admin/AdminService';
import { DashboardStats, EmpresaInforme, OfertaInforme, TitulosEstadoInforme } from '../../../../api/models/Admin/informesModule';
import { TablasAlertas } from "./tablas-alertas/tablas-alertas";
import { DashboardCharts } from './dahsboard-charts/dahsboard-charts';
import { Informes } from './informes/informes';
import { DashboardKpis } from './dahsboard-kpis/dahsboard-kpis';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    DrawerModule,
    DialogModule,
    TagModule,
    ButtonModule,
    TablasAlertas,
   DashboardKpis
,
DashboardCharts,
Informes,
TablasAlertas    
],
  providers: [MessageService],
  templateUrl: './main.html'
})
export class Main implements OnInit {
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);

  loading = true;
  errorApi = false;

  // Datos para los hijos
  stats: DashboardStats = { asignadas: 0, demandantes: 0, empresas: 0, ofertas: 0 };
  titulosInfo: TitulosEstadoInforme | null = null;
  empresasInactivas: EmpresaInforme[] = [];
  ofertasVacias: OfertaInforme[] = [];

  // Control de detalles
  selectedEmpresa: EmpresaInforme | null = null;
  visibleEmpresaDrawer = false;
  selectedOferta: OfertaInforme | null = null;
  visibleOfertaDialog = false;

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.errorApi = false;
    this.loading = true;

    forkJoin({
      asignadas: this.adminService.getOfertasAsignadas(),
      demandantes: this.adminService.getTotalDemandantes(),
      empresas: this.adminService.getTotalEmpresas(),
      ofertas: this.adminService.getOfertasAbiertas(),
      titulos: this.adminService.getTitulosEstado(),
      inactivas: this.adminService.getEmpresasSinOfertas(),
      vacias: this.adminService.getOfertasSinPostulantes()
    }).pipe(
      // Sincronizamos con un pequeño timer para que el skeleton luzca bien
      map(res => res),
      catchError(err => {
        this.errorApi = true;
        this.loading = false;
        return throwError(() => err);
      })
    ).subscribe({
      next: (res) => {
        // Mapeamos los totales a la interfaz de KPIs
        this.stats = {
          asignadas: res.asignadas.data ?? 0,
          demandantes: res.demandantes.data ?? 0,
          empresas: res.empresas.data?.total ?? 0,
          ofertas: res.ofertas.data?.total ?? 0
        };

        this.titulosInfo = res.titulos.data ?? null;
        this.empresasInactivas = res.inactivas.data?.listado.slice(0, 5) ?? [];
        this.ofertasVacias = res.vacias.data?.listado.slice(0, 5) ?? [];
        
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  verDetalleEmpresa(empresa: EmpresaInforme) {
    this.adminService.getDetalleEmpresa(empresa.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectedEmpresa = res.data;
          this.visibleEmpresaDrawer = true;
        }
      }
    });
  }

  verDetalleOferta(oferta: OfertaInforme) {
    this.selectedOferta = null; // Limpiar rastro anterior
    this.adminService.getDetalleOfertaAdmin(oferta.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.selectedOferta = res.data;
          this.visibleOfertaDialog = true;
        }
      }
    });
  }

  formatearUrl(url: string | undefined): string {
    if (!url) return '#';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }
}