import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-alumno-chart',
imports: [CommonModule, ChartModule],
  templateUrl: './alumno-chart.html',
  styleUrl: './alumno-chart.css',
})
export class AlumnoChart implements OnChanges{
@Input() graficoData: { proceso: number; conseguido: number; finalizados: number; retiradas: number } | undefined;
  @Input() totalInscripciones: number = 0;

  chartData: any;
  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graficoData'] && this.graficoData) {
      this.initChart();
    }
  }

private initChart() {
  if (!this.graficoData) return;

  // Calculamos el total real de la suma de los estados
  const sumaEstados = (this.graficoData.proceso || 0) + 
  (this.graficoData.conseguido || 0) + 
  (this.graficoData.finalizados || 0) + 
   (this.graficoData.retiradas || 0);

  const tieneDatos = sumaEstados > 0;

  if (!tieneDatos) {
    // ESTADO VACÍO: Forzamos el anillo gris
    this.chartData = {
      labels: ['Sin candidaturas'],
      datasets: [{
        data: sumaEstados ?? [1], // Valor ficticio para que el donut se rellene
        backgroundColor: ['#F1F5F9'], // Slate-100
        hoverBackgroundColor: ['#F1F5F9'],
        borderWidth: 0,
        weight: 1
      }]
    };
  } else {
    // ESTADO CON DATOS: Colores originales
    this.chartData = {
      labels: ['En Proceso', '¡Conseguido!', 'Descartes', 'Retiradas'],
      datasets: [{
        data: [
          this.graficoData.proceso, 
          this.graficoData.conseguido, 
          this.graficoData.finalizados, 
          this.graficoData.retiradas
        ],
        backgroundColor: ['#A855F7', '#10B981', '#94A3B8', '#F43F5E'],
        hoverBackgroundColor: ['#C084FC', '#34D399', '#CBD5E1', '#FB7185'],
        borderWidth: 0
      }]
    };
  }

  // Opciones del gráfico
  this.chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: tieneDatos, // Ocultamos la leyenda si es el anillo gris
        position: 'bottom',
        labels: { usePointStyle: true, font: { size: 12, weight: '600' } }
      },
      tooltip: {
        enabled: tieneDatos // Desactivamos el tooltip si no hay datos reales
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };
}
}
