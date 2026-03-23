import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alumno } from '../../../../services/DatosMain/alumno';
import { DashboardStats } from '../../../../api/models/Demandantes/demantantesResponse';
import { AlumnoChart } from './alumno-chart/alumno-chart';
import { AlumnoEmpleabilidadCard } from './alumno-empleabilidad-card/alumno-empleabilidad-card';
import { AlumnoKpis } from './alumno-kpis/alumno-kpis';

@Component({
  selector: 'app-main-alumno',
  standalone: true,
  imports: [CommonModule,AlumnoChart,AlumnoEmpleabilidadCard,AlumnoKpis ],
  templateUrl: './main-alumno.html'
})
export class MainAlumno implements OnInit {
  private alumnoService = inject(Alumno);
  
  // Usamos la interfaz para evitar 'any'
  dashboardData: DashboardStats | null = null;
  cargando = true;

  ngOnInit(): void {
    this.alumnoService.getDashboardStats().subscribe({
      next: (res) => {
        this.dashboardData = res.data ?? null;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }
}