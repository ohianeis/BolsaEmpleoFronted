import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { OfertasService } from './../../../../services/Ofertas/ofertas'; 
import { StatsEmpresa } from '../../../../api/models/Ofertas/ofertasResponse';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; 
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-main-empresa',
  imports: [ProgressSpinnerModule,RouterLink,ChartModule,CommonModule],
  templateUrl: './main-empresa.html',
  styleUrl: './main-empresa.css',
})
export class MainEmpresa {
// Inicialización segura para que el HTML no falle al cargar
 stats: StatsEmpresa = {
  ofertas_activas: 0,
  total_cerradas: 0,
  cerradas_con_exito: 0,
  candidatos_nuevos: 0,
  ofertas_con_pendientes: []
};
  mostrarPendientes = false; // Variable para el toggle de ver nuevos inscritos
  cargando: boolean = true;
// Datos para gráficos
  dataDonut: any;
  dataLine: any;
  optionsDonut: any;
  optionsLine: any;
  // Cambiado a minúscula la instancia del servicio para evitar conflictos
  constructor(private ofertasService: OfertasService) {}

  ngOnInit(): void {
    this.obtenerEstadisticas();
  }

obtenerEstadisticas(): void {
  this.cargando = true;
  

  this.ofertasService.getStatsEmpresa().subscribe({
    next: (res) => {
      // res es el objeto completo { data: { ofertas_activas: X... }, mensaje: '...' }
      if (res?.data) {
        this.stats = res.data;
        this.initCharts();
      }
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error:', err);
      this.cargando = false;
    }
  });
}
initCharts() {
    // Gráfico de Donut (Éxito)
    this.dataDonut = {
      labels: ['Éxito', 'Otras'],
      datasets: [{
        data: [this.stats.cerradas_con_exito, (this.stats.total_cerradas - this.stats.cerradas_con_exito)],
        backgroundColor: ['#22C55E', '#CBD5E1'],
        hoverBackgroundColor: ['#16A34A', '#94A3B8'],
        borderWidth: 0
      }]
    };

    this.optionsDonut = {
      cutout: '70%',
      plugins: { legend: { display: false } }
    };

    // Gráfico de Líneas (Tendencia - Datos de ejemplo, podrías traerlos de la API)
    this.dataLine = {
      labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
      datasets: [{
        label: 'Inscripciones',
        data: [12, 19, 3, 5, 22, 3, 10],
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    };

    this.optionsLine = {
      plugins: { legend: { display: false } },
      scales: {
        y: { display: false },
        x: { grid: { display: false } }
      },
      maintainAspectRatio: false
    };
  }
}
