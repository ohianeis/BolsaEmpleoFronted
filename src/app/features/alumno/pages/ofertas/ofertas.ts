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
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-ofertas',
  standalone: true,

  providers: [MessageService],
  imports: [CommonModule, ButtonModule,PaginatorModule, TagModule, DrawerModule, ToastModule, SkeletonModule, TooltipModule],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css'
})
export class Ofertas implements OnInit {
  listaOfertas: OfertaDemandante[] = [];

  // VARIABLES PARA PAGINACIÓN
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0; // Índice del primer registro (PrimeNG lo usa así)
  paginaActual: number = 1;
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

 cargarOfertas(page: number = 1) {
    this.cargando = true;
    this.listaOfertas = [];
    this.demandanteService.getOfertas(page, this.rows).subscribe({
    next: (res) => {

   if (res && res.data && Array.isArray(res.data.data)) {
                this.listaOfertas = res.data.data; 
                this.totalRecords = res.data.total;
            } else {
                console.error('La estructura de datos no es la esperada', res);
                this.listaOfertas = [];
                this.totalRecords = 0;
            }
      
      this.cargando = false;
    },
      error: (err) => {
        this.showToast('error', 'Error', 'No se pudieron cargar las ofertas');
        this.cargando = false;
      }
    });
  }
//  dispara PrimeNG al cambiar de página
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginaActual = event.page + 1; // PrimeNG empieza en 0, Laravel en 1
    this.cargarOfertas(this.paginaActual);
    
    // Opcional: Scroll arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
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