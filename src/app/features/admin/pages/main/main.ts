import { Component, OnInit, inject } from '@angular/core';
import { AdminService } from '../../../../services/Admin/AdminService';
import { EmpresaInforme, OfertaInforme, TitulosEstadoInforme } from '../../../../api/models/Admin/informesModule';
import { ChartModule } from 'primeng/chart';     // Para el gráfico de Donuts/Líneas
import { TagModule } from 'primeng/tag';         // Para etiquetas de estado
import { ButtonModule } from 'primeng/button';   // Para el botón de "Descargar Informe"
import { SkeletonModule } from 'primeng/skeleton'; // Para el efecto de carga inicial
import { ToastModule } from 'primeng/toast';     //  mostrar errores de APIuier
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-main',
 
  standalone: true,
  imports: [
    CommonModule,     
    ChartModule, 
    TagModule, 
    ButtonModule, 
    SkeletonModule,
    ToastModule,
    TableModule,
    DrawerModule,
    DialogModule
  ],
   templateUrl: './main.html',
   styleUrl: './main.css'
})
export class Main implements OnInit {
  private adminService = inject(AdminService);

  // Totales para las tarjetas (KPIs)
  totalAsignadas: number = 0;
  totalDemandantes: number = 0;
  totalEmpresas: number = 0;
  totalOfertasAbiertas: number = 0;
empresasInactivas: EmpresaInforme[] = [];
ofertasVacias: OfertaInforme[] = [];
// Para empresas
selectedEmpresa: EmpresaInforme | null = null;
visibleEmpresaDrawer: boolean = false;

// Para ofertas
selectedOferta: OfertaInforme | null = null;
visibleOfertaDialog: boolean = false;

  // Datos para el gráfico de PrimeNG
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // 1. Éxito de inserción
    this.adminService.getOfertasAsignadas().subscribe(res => this.totalAsignadas = res.data ?? 0);

    // 2. Volumen de usuarios
    this.adminService.getTotalDemandantes().subscribe(res => this.totalDemandantes = res.data ?? 0);

    // 3. Actividad de empresas
    this.adminService.getTotalEmpresas().subscribe(res => this.totalEmpresas = res.data?.total ?? 0);

    // 4. Ofertas actuales
    this.adminService.getOfertasAbiertas().subscribe(res => this.totalOfertasAbiertas = res.data?.total ?? 0);

    // 5. Datos para el gráfico de Donuts (Títulos)
  this.adminService.getTitulosEstado().subscribe(res => {
  if (res.data) {
    this.configurarGraficoTitulos(res.data);
  }
});
// 6. Empresas que no han publicado nunca
  this.adminService.getEmpresasSinOfertas().subscribe(res => {
    if (res.data) this.empresasInactivas = res.data.listado.slice(0, 5); // Solo las 5 primeras
  });

  // 7. Ofertas que nadie quiere (o nadie ve)
  this.adminService.getOfertasSinPostulantes().subscribe(res => {
    if (res.data) this.ofertasVacias = res.data.listado.slice(0, 5);
  });
  }

  configurarGraficoTitulos(datos: TitulosEstadoInforme) {
    this.chartData = {
      labels: ['Activos', 'Extinguidos'],
      datasets: [
        {
          data: [datos.totalActivos, datos.totalInactivos],
          backgroundColor: ['#10b981', '#64748b'],
          hoverBackgroundColor: ['#059669', '#475569']
        }
      ]
    };
  }
  // Métodos para abrir los detalles
// Actualizamos para que sea "bajo demanda"
verDetalleEmpresa(empresaSimple: any) {
  // Mostramos un esqueleto o cargador si quieres, pero llamamos a la API
  this.adminService.getDetalleEmpresa(empresaSimple.id).subscribe(res => {
    if (res.data) {
      this.selectedEmpresa = res.data;
      this.visibleEmpresaDrawer = true;
    }
  });
}

// En tu Main.ts

verDetalleOferta(ofertaSimple: any) {
  // 1. Obtenemos el ID del objeto que viene de la tabla
  const id = ofertaSimple.id;
  if (!id) return;

  // 2. Limpiamos la selección anterior para evitar "efecto fantasma"
  this.selectedOferta = null;

  // 3. Llamamos al nuevo endpoint de administración
  this.adminService.getDetalleOfertaAdmin(id).subscribe({
    next: (res) => {
      if (res.data) {
        this.selectedOferta = res.data;
        this.visibleOfertaDialog = true; // Aquí abrimos el Drawer/Dialog
      }
    },
    error: (err) => {
      console.error('Error al cargar la oferta:', err);
      // Opcional: mostrar un toast de error aquí
    }
  });
}
// En tu Main.ts
formatearUrl(url: string | undefined): string {
  if (!url) return '#';
  // Si no empieza por http:// o https://, se lo añadimos
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

}