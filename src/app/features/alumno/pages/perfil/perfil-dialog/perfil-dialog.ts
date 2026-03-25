import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
// Tus modelos
import { TituloAlumno } from '../../../../../api/models/Titulos/titulosResponse';
import { Cv } from '../../../../../api/models/CV/CvResponse';
import { PerfilDemandante } from '../../../../../api/models/Demandantes/demantantesResponse';
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-perfil-dialog',
imports: [CommonModule, Dialog, Tag, Button],
  templateUrl: './perfil-dialog.html',
  styleUrl: './perfil-dialog.css',
})
export class PerfilDialog {
@Input() visible: boolean = false;
  @Input() perfil: PerfilDemandante | null = null;
  @Input() misTitulos: TituloAlumno[] = [];
@Input() miCv: Cv | null | undefined = null;
  @Output() onHide = new EventEmitter<void>();

  // Helper para el cierre del diálogo
  close() {
    this.onHide.emit();
  }
}
