import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CandidatoElegible } from '../../../../../api/models/Ofertas/ofertasResponse';
@Component({
  selector: 'app-candidato-sugerido',
imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './candidato-sugerido.html',
  styleUrl: './candidato-sugerido.css',
})
export class CandidatoSugerido {
@Input({ required: true }) candidato!: CandidatoElegible;
  
  @Output() onVer = new EventEmitter<number>();
  @Output() onInscribir = new EventEmitter<number>();
}
