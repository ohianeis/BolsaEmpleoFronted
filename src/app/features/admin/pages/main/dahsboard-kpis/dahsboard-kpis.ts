import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DashboardStats } from '../../../../../api/models/Admin/informesModule';

// Definimos la interfaz aquí mismo o impórtala si la tienes en un archivo de modelos


@Component({
  selector: 'app-dashboard-kpis',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './dahsboard-kpis.html'
})
export class DashboardKpis {
  // Recibe los datos ya procesados del padre (Main)
  @Input() stats: DashboardStats = {
    asignadas: 0,
    demandantes: 0,
    empresas: 0,
    ofertas: 0
  };

  @Input() loading: boolean = false;
}