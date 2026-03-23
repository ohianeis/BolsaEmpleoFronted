import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { TitulosEstadoInforme } from '../../../../../api/models/Admin/informesModule';

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [CommonModule, ChartModule, SkeletonModule],
  templateUrl: './dahsboard-charts.html'
})
export class DashboardCharts implements OnChanges {
  // Recibimos la interfaz que definiste antes
  @Input() dataTitulos: TitulosEstadoInforme | null = null;
  @Input() loading: boolean = false;

  chartData: any; // PrimeNG requiere un objeto de configuración
  chartOptions: any;

  constructor() {
    this.configurarOpciones();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si los datos cambian y no son nulos, actualizamos el gráfico
    if (changes['dataTitulos'] && this.dataTitulos) {
      this.prepararDatosGrafico();
    }
  }

  private prepararDatosGrafico(): void {
    if (!this.dataTitulos) return;

    this.chartData = {
      labels: ['Títulos Activos', 'En Extinción'],
      datasets: [
        {
          data: [this.dataTitulos.totalActivos, this.dataTitulos.totalInactivos],
          backgroundColor: ['#10b981', '#64748b'], // Emerald 500 y Slate 500
          hoverBackgroundColor: ['#059669', '#475569'],
          borderWidth: 0,
          weight: 1
        }
      ]
    };
  }

  private configurarOpciones(): void {
    this.chartOptions = {
      cutout: '75%', // Grosor del donut
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: 'bold'
            },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          bodyFont: { size: 14, weight: 'bold' },
          usePointStyle: true
        }
      },
      maintainAspectRatio: false
    };
  }
}