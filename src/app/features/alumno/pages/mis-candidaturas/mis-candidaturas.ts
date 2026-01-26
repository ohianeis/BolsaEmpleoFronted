import { DemandanteService } from './../../../../services/Ofertas/Demandantes/DemandanteService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Drawer } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-mis-candidaturas',
  standalone: true,
  imports: [CommonModule, RouterModule, Skeleton, Tag, ButtonModule, Toast, Drawer,TabsModule,TooltipModule],
  providers: [MessageService],
  templateUrl: './mis-candidaturas.html'
})
export class MisCandidaturas implements OnInit {
  candidaturas: any[] = [];
  loading: boolean = true;
  displayDetalle: boolean = false;
  seleccionada: any = null;
//controlar el expansion
ofertaExpandidaId: number | null = null;
  constructor(
    private ofertaService: DemandanteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarCandidaturas();
  }

  cargarCandidaturas() {
    this.loading = true;
    this.ofertaService.getMisInscripciones().subscribe({
      next: (res) => {
        
          this.candidaturas = res.data || [];
      
        setTimeout(() => this.loading = false, 600);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message
        });
        this.loading = false;
      }
    });
  }
// separar de cargarCandidaturas las abiertas y las cerradas

//activas e inscrito en ellas
get candidaturasActivas() {
  return this.candidaturas.filter(item => 
    item.infoDemandante?.estadoProceso?.toLowerCase() === 'en proceso' || 
    item.infoDemandante?.estadoProceso?.toLowerCase() === 'inscrito'
  );
}
//adjudicadas al candidato
get candidaturasAdjudicadas() {
  return this.candidaturas.filter(item => 
    item.infoDemandante?.estadoProceso?.toLowerCase() === 'adjudicada'
  );
}

// finalizadas y no adjudicadas al candidato
get candidaturasFinalizadas() {
  return this.candidaturas.filter(item => 
    (item.infoDemandante?.estadoProceso?.toLowerCase() === 'cerrada' || 
     item.infoDemandante?.estadoProceso?.toLowerCase() === 'descartado') &&
    item.infoDemandante?.estadoProceso?.toLowerCase() !== 'adjudicada'
  );
}

  verDetalle(oferta: any) {
    this.seleccionada = oferta;
    this.displayDetalle = true;
  }
//pulsar el expandir tarjeta para mas info
toggleExpandir(id: number) {
  this.ofertaExpandidaId = this.ofertaExpandidaId === id ? null : id;
}
 getSeverityCandidato(estado: string | undefined): "success" | "info" | "warn" | "danger" | "secondary" {
  const e = estado?.toLowerCase() || '';
  if (e.includes('inscrito') || e.includes('enviada')) return 'info';
  if (e.includes('visto') || e.includes('proceso')) return 'warn';
  if (e.includes('entrevista') || e.includes('seleccionado')) return 'success';
  if (e.includes('descartado') || e.includes('rechazado')) return 'danger';
  return 'secondary';
}

getIconCandidato(estado: string | undefined): string {
  const e = estado?.toLowerCase() || '';
  if (e.includes('inscrito')) return 'pi-send text-blue-500';
  if (e.includes('visto')) return 'pi-eye text-orange-500';
  if (e.includes('entrevista')) return 'pi-phone text-purple-500';
  if (e.includes('seleccionado')) return 'pi-check-circle text-green-500';
  if (e.includes('descartado')) return 'pi-times-circle text-red-500';
  return 'pi-info-circle text-slate-400';
}

getBgColorCandidato(estado: string | undefined): string {
  const e = estado?.toLowerCase() || '';
  if (e.includes('inscrito')) return 'bg-blue-50';
  if (e.includes('visto')) return 'bg-orange-50';
  if (e.includes('entrevista')) return 'bg-purple-50';
  if (e.includes('seleccionado')) return 'bg-green-50';
  if (e.includes('descartado')) return 'bg-red-50';
  return 'bg-slate-50';
}
}