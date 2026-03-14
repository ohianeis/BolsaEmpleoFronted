import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ayuda-pasos',
  imports: [NgClass],
  templateUrl: './ayuda-pasos.html',
  styleUrl: './ayuda-pasos.css',
})
export class AyudaPasos {
@Input() pasos: any[] = [];
  @Input() colorClase: string = 'bg-blue-600'; // Clase de Tailwind para el color
}
