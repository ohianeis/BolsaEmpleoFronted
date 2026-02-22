import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandanteService } from './../../../../services/Ofertas/Demandantes/DemandanteService';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';

// Modelos
import { OfertaDemandante, DetalleOfertaDemandante } from '../../../../api/models/Demandantes/demantantesResponse';

@Component({
  selector: 'app-ofertas',
  standalone: true,

  providers: [MessageService],
  imports: [CommonModule, ButtonModule, TagModule, DrawerModule, ToastModule, SkeletonModule, TooltipModule],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css'
})
export class Ofertas implements OnInit {
  listaOfertas: OfertaDemandante[] = [];
  detalleCargado: DetalleOfertaDemandante | null = null;
  
  public cargando: boolean = false;           // Carga de la lista inicial
  cargandoDetalle: boolean = false;    // Carga al pulsar la flecha
  
  ofertaExpandidaId: number | null = null;
  displayEmpresa: boolean = false;

  constructor(
    private demandanteService: DemandanteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.cargando = true;
    this.demandanteService.getOfertas().subscribe({
      next: (res) => {
      
        this.listaOfertas = res.data ?? [];
        this.cargando = false;
      },
      error: (err) => {
        this.showToast('error', 'Error', 'No se pudieron cargar las ofertas');
        this.cargando = false;
      }
    });
  }

 toggleExpandir(id: number) {
    if (this.ofertaExpandidaId === id) {
      this.ofertaExpandidaId = null;
      this.detalleCargado = null;
      return;
    }

    // 1. Marcamos qué ID se está expandiendo y reseteamos el detalle anterior
    this.ofertaExpandidaId = id;
    this.detalleCargado = null; 
    this.cargandoDetalle = true;

    // 2. Cargamos el detalle del servidor
    this.demandanteService.getDetalleOferta(id).subscribe({
      next: (res) => {
        this.detalleCargado = res.data ?? null;
        this.cargandoDetalle = false;
      },
      error: () => {
        this.showToast('error', 'Error', 'No se pudo cargar el detalle');
        this.cargandoDetalle = false;
        this.ofertaExpandidaId = null;
      }
    });
  }
  verPerfilEmpresa() {
    // Como ya tenemos 'detalleCargado' por la flecha, lo usamos directamente
    if (this.detalleCargado && this.detalleCargado.empresa) {
      this.displayEmpresa = true;
    }
  }

  inscribirse(id: number) {
    this.demandanteService.inscribirse(id).subscribe({
      next: (res) => {
        this.showToast('success', '¡Éxito!', String(res.message) || 'Inscripción realizada');
        this.displayEmpresa = false;
        this.ofertaExpandidaId = null; // Cerramos la tarjeta
        this.cargarOfertas(); // Refrescamos la lista
      },
      error: (err) => this.showToast('error', 'Error', err.error?.message || 'Error al inscribirse')
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}