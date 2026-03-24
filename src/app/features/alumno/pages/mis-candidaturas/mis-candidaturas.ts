import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';

// Componentes Refactorizados


// Servicios y Modelos
import { DemandanteService } from '../../../../services/Ofertas/Demandantes/DemandanteService';
import { DetalleOfertaDemandante } from '../../../../api/models/Demandantes/demantantesResponse';
import { CandidaturasCard } from "./candidaturas-card/candidaturas-card";
import { CandidaturasTabs } from './candidaturas-tabs/candidaturas-tabs';
import { EmpresaDrawer } from './empresa-drawer/empresa-drawer';


@Component({
  selector: 'app-mis-candidaturas',
  standalone: true,
  imports: [
    CommonModule, ToastModule, ConfirmDialogModule, PaginatorModule,
    CandidaturasCard,CandidaturasTabs,EmpresaDrawer
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mis-candidaturas.html'
})
export class MisCandidaturas implements OnInit {
  // Inyecciones modernas con inject()
  private ofertaService = inject(DemandanteService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Estado del componente
  candidaturas: DetalleOfertaDemandante[] = [];
  loading: boolean = true;
  tabActual: string = 'activas';
  displayDetalle: boolean = false;
  seleccionada: any = null;
  ofertaExpandidaId: number | null = null;

  // Paginación
  totalRecords: number = 0;
  rows: number = 10;
  currentPage: number = 0;

  totalesCandidaturas = { activas: 0, conseguidas: 0, retiradas: 0, finalizadas: 0 };

  ngOnInit(): void {
    this.cargarCandidaturas();
  }

  cargarCandidaturas(page: number = 0) {
    this.loading = true;
    this.ofertaService.getMisInscripciones(page, this.rows, this.tabActual).subscribe({
      next: (res) => {
        if (res.data) {
          this.candidaturas = res.data.data;
          this.totalRecords = res.data.total;
          this.rows = res.data.per_page;
          
        // recuperar stats
        const d = res.data as any; // alias para acceder con as
        
        if (d.stats) {
          this.totalesCandidaturas = {
            activas: d.stats.activas || 0,
            conseguidas: d.stats.conseguidas || 0,
            retiradas: d.stats.retiradas || 0,
            finalizadas: d.stats.finalizadas || 0
          };
          console.log('Stats actualizadas:', this.totalesCandidaturas);
        }
      }
      this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  ejecutarCambioTab(tab: string) {
    this.tabActual = tab;
    this.currentPage = 0;
    this.ofertaExpandidaId = null; // Cerramos cualquier tarjeta abierta al cambiar de tab
    this.cargarCandidaturas(0);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.cargarCandidaturas(event.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleExpandir(id: number) {
    this.ofertaExpandidaId = this.ofertaExpandidaId === id ? null : id;
  }

  verDetalle(oferta: any) {
    this.seleccionada = oferta;
    this.displayDetalle = true;
  }

  // --- LÓGICA DE ACCIONES (API) ---

  confirmarDesapuntarse(idOferta: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres retirar tu candidatura?',
      header: 'Confirmar Retirada',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.ejecutarDesapuntarse(idOferta)
    });
  }

  private ejecutarDesapuntarse(id: number) {
    this.ofertaService.desapuntarse(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Candidatura retirada' });
        this.cargarCandidaturas(this.currentPage);
        this.displayDetalle = false; // Por si lo hizo desde el drawer
      }
    });
  }

  reInscribirse(id: number) {
    this.ofertaService.inscribirse(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Inscripción reactivada' });
        this.cargarCandidaturas(this.currentPage);
        this.displayDetalle = false;
      }
    });
  }
}