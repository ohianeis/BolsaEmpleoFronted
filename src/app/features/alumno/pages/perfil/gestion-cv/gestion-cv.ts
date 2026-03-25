import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { Cv } from '../../../../../api/models/CV/CvResponse'; // Ajusta la ruta
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gestion-cv',
  standalone: true,
  imports: [CommonModule, FileUploadModule, Button],
  templateUrl: './gestion-cv.html'
})
export class GestionCv {
@Input() miCv: Cv | null | undefined = null;
  @Output() onSubir = new EventEmitter<File>();
  @Output() onBorrar = new EventEmitter<void>();

  handleUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    if (file) {
      this.onSubir.emit(file);
    }
  }

  handleDelete() {
    this.onBorrar.emit();
  }
}