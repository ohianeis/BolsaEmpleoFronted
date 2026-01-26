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
  listaOfertas: any[] = []; // Usamos any para permitir la expansión dinámica de datos
  ofertaSeleccionada: DetalleOfertaDemandante | null = null;
  cargando: boolean = false;
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
      return;
    }

    const oferta = this.listaOfertas.find(o => o.id === id);
    
    // Si no tiene 'observacion', cargamos el detalle (Lazy Loading)
    if (oferta && !oferta.observacion) {
      this.demandanteService.getDetalleOferta(id).subscribe({
        next: (res) => {
          Object.assign(oferta, res.data); // Fusionamos datos (títulos, empresa, etc)
          this.ofertaExpandidaId = id;
        },
        error: () => this.showToast('error', 'Error', 'No se pudo cargar el detalle')
      });
    } else {
      this.ofertaExpandidaId = id;
    }
  }

  verPerfilEmpresa(ofertaId: number) {
    const oferta = this.listaOfertas.find(o => o.id === ofertaId);
    if (oferta && oferta.empresa) {
      this.ofertaSeleccionada = oferta as unknown as DetalleOfertaDemandante;
      this.displayEmpresa = true;
    }
  }

  inscribirse(id: number) {
    this.demandanteService.inscribirse(id).subscribe({
      next: (res) => {
        this.showToast('success', '¡Éxito!', res.message as string);
        this.displayEmpresa = false;
        this.cargarOfertas();
      },
      error: (err) => this.showToast('error', 'Error', err.error?.message || 'Error al inscribirse')
    });
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}