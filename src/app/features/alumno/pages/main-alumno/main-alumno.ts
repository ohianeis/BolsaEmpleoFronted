import { DemandanteService } from './../../../../services/Ofertas/Demandantes/DemandanteService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
// Servicios y Modelos


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
  
  // Objeto para almacenar las estadísticas de las cards
  stats = {
    inscripciones: 0,
    titulos: 0,
    ofertas: 0
  };

  chartData: any;
  chartOptions: any;
  cargando: boolean = true;

  constructor(private demandanteService: DemandanteService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando = true;

    forkJoin({
      inscripciones: this.demandanteService.getMisInscripciones(),
      titulos: this.demandanteService.getTitulos(),
      ofertas: this.demandanteService.getOfertas()
    }).subscribe({
      next: (res) => {
        // 1. Cálculos de datos
        const inscripcionesData = res.inscripciones.data || [];
        const inscripcionesValidas = inscripcionesData.filter((i: any) => 
            i.infoDemandante?.estado_candidato_id !== 8 && 
            i.infoDemandante?.seguimientoCandidato?.toLowerCase() !== 'candidato desapuntado'
        );
        
        const totalTitulos = res.titulos.data?.length || 0;
        const ofertasNuevas = res.ofertas.data?.filter((o: any) => !o.inscrito).length || 0;

        // 2. ACTIVAR ANIMACIONES (Esto es lo que faltaba para llenar las tarjetas)
        this.animateCount(inscripcionesValidas.length, 'inscripciones');
        this.animateCount(totalTitulos, 'titulos');
        this.animateCount(ofertasNuevas, 'ofertas');

        // 3. Configurar el gráfico
        this.configurarGrafico(inscripcionesData);
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error', err);
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error de sincronización',
          detail: err.error?.message || 'No se pudieron cargar los datos'
        });
      }
    });
  }

  // MÉTODO PARA EL GRÁFICO
  configurarGrafico(inscripciones: any[]) {
    const counts = {
      inscritos: 0,
      proceso: 0,
      exito: 0,
      finalizados: 0
    };

    inscripciones.forEach(i => {
      // Extraemos datos y limpiamos el texto para evitar errores por espacios o mayúsculas
      const estadoTexto = i.infoDemandante?.seguimientoCandidato?.toLowerCase().trim() || '';
      const procesoTexto = i.infoDemandante?.estadoProceso?.toLowerCase().trim() || '';
      const estadoId = i.infoDemandante?.estado_candidato_id;

      // 1. Ignorar desapuntados (ID 8)
      if (estadoId === 8 || estadoTexto.includes('desapuntado')) return;

      // 2. ÉXITO (Seleccionado / Adjudicada)
      if (procesoTexto === 'adjudicada' || estadoId === 7 || estadoTexto.includes('seleccionado')) {
        counts.exito++;
      } 
      // 3. FINALIZADOS (Descartados o Proceso Cerrado)
      // Agregamos el ID 6 que es el de "Descartado"
      else if (estadoId === 6 || estadoTexto.includes('descartado') || procesoTexto === 'cerrada') {
        counts.finalizados++;
      }
      // 4. EN PROCESO (Entrevistas, Pruebas, etc.)
      else if ([3, 4, 5].includes(estadoId) || estadoTexto.includes('entrevista') || estadoTexto.includes('prueba')) {
        counts.proceso++;
      }
      // 5. NUEVOS / VISTOS
      else {
        counts.inscritos++;
      }
    });

    this.chartData = {
      labels: ['Nuevos', 'En Proceso', '¡Conseguido!', 'Cerrados/Descarte'],
      datasets: [{
        data: [counts.inscritos, counts.proceso, counts.exito, counts.finalizados],
        backgroundColor: ['#3B82F6', '#A855F7', '#10B981', '#94A3B8'],
        hoverBackgroundColor: ['#60A5FA', '#C084FC', '#34D399', '#CBD5E1'],
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
        },
        // Esto añade una animación suave al cargar
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    };
  }

  // MÉTODO PARA ANIMAR NÚMEROS
  animateCount(target: number, key: 'inscripciones' | 'titulos' | 'ofertas') {
    this.stats[key] = 0; // Reset inicial
    if (target === 0) return;

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