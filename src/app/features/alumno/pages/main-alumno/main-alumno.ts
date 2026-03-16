import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { Alumno } from '../../../../services/DatosMain/alumno';
import { DashboardStats } from '../../../../api/models/Demandantes/demantantesResponse';

// Servicios e Interfaces

@Component({
  selector: 'app-main-alumno',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    ChartModule
  ],
  providers: [MessageService],
  templateUrl: './main-alumno.html',
  styleUrl: './main-alumno.css'
})
export class MainAlumno implements OnInit {
  
  // Tipamos con nuestra interfaz para tener autocompletado
  stats = {
    inscripciones: 0,
    titulos: 0,
    ofertas: 0
  };

  chartData: any;
  chartOptions: any;
  cargando: boolean = true;

  constructor(
    private demandanteService: Alumno, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando = true;
    
    // Llamada única al nuevo endpoint optimizado
    this.demandanteService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.data) {
          const d = res.data;

          // 1. Animamos los contadores de las tarjetas con los datos directos del server
          this.animateCount(d.cards.inscripciones, 'inscripciones');
          this.animateCount(d.cards.titulos, 'titulos');
          this.animateCount(d.cards.ofertas, 'ofertas');

          // 2. Configuramos el gráfico con los datos ya segmentados
          this.configurarGrafico(d.grafico);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las estadísticas'
        });
      }
    });
  }

configurarGrafico(grafico: any) {
  this.chartData = {
    labels: ['En Proceso', '¡Conseguido!', 'Descartes', 'Retiradas'],
    datasets: [{
      data: [
        grafico.proceso, 
        grafico.conseguido, 
        grafico.finalizados, 
        grafico.retiradas
      ],
      backgroundColor: [
        '#A855F7', // Morado (Proceso)
        '#10B981', // Verde (Éxito)
        '#94A3B8', // Gris (Finalizados por la empresa)
        '#F43F5E'  // Rojo/Rosa (Retiradas por el alumno)
      ],
      hoverBackgroundColor: ['#C084FC', '#34D399', '#CBD5E1', '#FB7185'],
      borderWidth: 0
    }]
  };

  this.chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          usePointStyle: true, 
          padding: 20,
          font: { size: 12, weight: '600' }
        }
      }
    }
  };
}

  animateCount(target: number, key: keyof typeof this.stats) {
    this.stats[key] = 0;
    if (target <= 0) return;

    let start = 0;
    const duration = 800;
    const stepTime = Math.max(duration / target, 30);
    
    const timer = setInterval(() => {
      start++;
      this.stats[key] = start;
      if (start >= target) clearInterval(timer);
    }, stepTime);
  }
}