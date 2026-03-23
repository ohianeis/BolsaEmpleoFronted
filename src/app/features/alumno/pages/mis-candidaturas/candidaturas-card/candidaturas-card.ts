import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DetalleOfertaDemandante } from '../../../../../api/models/Demandantes/demantantesResponse';

@Component({
  selector: 'app-candidatura-card',
  standalone: true,
  imports: [CommonModule, Tag, ButtonModule, TooltipModule],
  templateUrl: './candidaturas-card.html',
  styleUrl: './candidaturas-card.css'
})
export class CandidaturasCard {
  @Input() item!: DetalleOfertaDemandante;
  @Input() esHistorico: boolean = false;
  @Input() expandida: boolean = false;

  @Output() onToggleExpandir = new EventEmitter<number>();
  @Output() onVerEmpresa = new EventEmitter<any>();
  @Output() onRetirar = new EventEmitter<number>();
  @Output() onReinscribir = new EventEmitter<number>();

 getSeverityCandidato(estado: string | undefined): "success" | "info" | "warn" | "danger" | "secondary" {
    const e = estado?.toLowerCase() || '';
    if (e.includes('inscrito') || e.includes('enviada')) return 'info';
    if (e.includes('desapuntado') || e.includes('retirada')) return 'secondary';
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