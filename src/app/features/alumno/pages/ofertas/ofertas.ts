import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandanteService } from './../../../../services/Ofertas/Demandantes/DemandanteService';
import { MessageService } from 'primeng/api';

// PrimeNG
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';

// Mis Nuevos Componentes

// Modelos
import { OfertaDemandante, DetalleOfertaDemandante } from '../../../../api/models/Demandantes/demantantesResponse';

import { OfertasSkeleton } from './oferta-skeleton/oferta-skeleton';
import { OfertaCard } from './oferta-card/oferta-card';
import { OfertaDetalle } from './oferta-detalle/oferta-detalle';
import { EmpresaDrawer } from './empresa-drawer/empresa-drawer';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule, ToastModule, PaginatorModule,OfertasSkeleton,OfertaCard,OfertaDetalle,EmpresaDrawer
   
  ],
  templateUrl: './ofertas.html'
})
export class Ofertas implements OnInit {
  listaOfertas: OfertaDemandante[] = [];
  
  // Paginación
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  paginaActual: number = 0;

  // Estados
  public cargando: boolean = false;
  public cargandoDetalle: boolean = false;
  public ofertaExpandidaId: number | null = null;
  public detalleCargado: DetalleOfertaDemandante | null = null;
  public displayEmpresa: boolean = false;

  constructor(
    private demandanteService: DemandanteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(page: number = 0) {
    this.cargando = true;
    this.demandanteService.getOfertas(page, this.rows).subscribe({
      next: (res) => {
        if (res?.data?.data) {
          this.listaOfertas = res.data.data;
          this.totalRecords = res.data.total;
        }
        this.cargando = false;
      },
      error: () => {
        this.showToast('error', 'Error', 'No se pudieron cargar las ofertas');
        this.cargando = false;
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginaActual = event.page;
    this.cargarOfertas(this.paginaActual);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleExpandir(id: number) {
    if (this.ofertaExpandidaId === id) {
      this.ofertaExpandidaId = null;
      this.detalleCargado = null;
      return;
    }

    this.ofertaExpandidaId = id;
    this.detalleCargado = null;
    this.cargandoDetalle = true;

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

  inscribirse(id: number | undefined) {
    if (!id) return;
    this.demandanteService.inscribirse(id).subscribe({
      next: (res) => {
        this.showToast('success', '¡Éxito!', String(res.message) || 'Inscripción realizada');
        this.displayEmpresa = false;
        this.ofertaExpandidaId = null;
        this.cargarOfertas(this.paginaActual);
      },
      error: (err) => this.showToast('error', 'Error', err.error?.message || 'Error al inscribirse')
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}