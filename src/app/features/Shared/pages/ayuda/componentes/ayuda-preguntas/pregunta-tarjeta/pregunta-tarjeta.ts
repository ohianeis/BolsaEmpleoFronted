import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pregunta-tarjeta',
  imports: [NgClass],
  templateUrl: './pregunta-tarjeta.html',
  styleUrl: './pregunta-tarjeta.css',
})
export class PreguntaTarjeta {
@Input() titulo: string = '';
  @Input() respuesta: string = '';
  @Input() claseBorde: string = '';
}
