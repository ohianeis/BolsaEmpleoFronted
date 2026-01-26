import { DemandanteService } from './../../../../services/Ofertas/Demandantes/DemandanteService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast';
// Servicios y Modelos


@Component({
  selector: 'app-main-alumno',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ToastModule
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

  cargando: boolean = true;

  constructor(private demandanteService: DemandanteService,private messageService: MessageService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  /**
   * Carga los datos de las 3 tarjetas de forma simultánea
   */
cargarEstadisticas() {
  this.cargando = true;

  forkJoin({
    inscripciones: this.demandanteService.getMisInscripciones(),
    titulos: this.demandanteService.getTitulos(),
    ofertas: this.demandanteService.getOfertas()
  }).subscribe({
    next: (res) => {
      this.stats.inscripciones = res.inscripciones.data?.length || 0;
      this.stats.titulos = res.titulos.data?.length || 0;
      
      // FILTRO CLAVE: Solo contamos las que NO está inscrito
const ofertasNuevas = res.ofertas.data?.filter((o: any) => !o.inscrito) || [];
      this.stats.ofertas = ofertasNuevas.length;
      
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error', err);
      this.cargando = false;
      this.messageService.add({
          severity: 'error',
          summary: 'Error de sincronización',
          detail: err.error?.message || 'No se pudieron cargar tus datos de perfil'
        });
    }
  });
}
}