import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CandidatoResumen, EstadoCandidato } from "../../../../../api/models/Ofertas/ofertasResponse";
import { Component, EventEmitter, Input, Output } from "@angular/core";
type TagSeverity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | null
  | undefined;
@Component({
  selector: 'app-candidato-tabla',
  standalone: true,
  imports: [TableModule  , TagModule, ButtonModule, CommonModule],
  templateUrl: './candidato-tabla.html'
})
export class CandidatoTabla {
  @Input() ofertaEstado: string = ''; 
  @Input() candidatos: CandidatoResumen[] = [];
  @Input() loading: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() rows: number = 5;
  @Input() estados: EstadoCandidato[] = [];
  @Input() ofertaAbierta: boolean = true;

  @Output() onVerPerfil = new EventEmitter<number>();
  @Output() onAsignar = new EventEmitter<number>();
  @Output() onPageChange = new EventEmitter<any>();

  getNombreEstado(id: number): string {
    const estado = this.estados.find(e => Number(e.id) === Number(id));
    return estado ? estado.nombre : 'Inscrito';
  }

 getSeverityEstado(id: number): TagSeverity {
    const estadoId = Number(id);
    switch (estadoId) {
      case 1: return 'info';
      case 2: return 'secondary';
      case 3: 
      case 4: return 'warn';
      case 5: return 'success';
      case 6: return 'danger';
      case 7: return 'success';
      case 8: return 'danger';
      default: return 'secondary';
    }
  }
}