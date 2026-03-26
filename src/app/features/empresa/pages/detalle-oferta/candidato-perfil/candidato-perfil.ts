import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CandidatoCompleto, EstadoCandidato } from '../../../../../api/models/Ofertas/ofertasResponse';
import { Cv } from '../../../../../api/models/CV/CvResponse';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-candidato-perfil',
imports: [
    CommonModule, 
    DialogModule, 
    ProgressSpinnerModule, 
    TagModule, 
    Select, 
    Textarea, 
    FormsModule, 
    ButtonModule
  ],  templateUrl: './candidato-perfil.html',
  styleUrl: './candidato-perfil.css',
})
export class CandidatoPerfil {
@Input() visible: boolean = false;
  @Input() cargando: boolean = false;
  @Input() perfil?: CandidatoCompleto; 
  @Input() cv: Cv | null = null;
  @Input() estados: EstadoCandidato[] = [];
  @Input() mostrarBotonInscribir: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onGuardarSeguimiento = new EventEmitter<void>();
  @Output() onInscribir = new EventEmitter<number>();

  cerrar() {
    this.visibleChange.emit(false);
  }

  inscribir() {
    if (this.perfil) {
      this.onInscribir.emit(this.perfil.id);
      this.cerrar();
    }
  }
}
