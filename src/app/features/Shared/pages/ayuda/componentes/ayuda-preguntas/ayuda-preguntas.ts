import { Component, Input } from '@angular/core';
import { PreguntaTarjeta } from './pregunta-tarjeta/pregunta-tarjeta';

@Component({
  selector: 'app-ayuda-preguntas',
  imports: [PreguntaTarjeta],
  templateUrl: './ayuda-preguntas.html',
  styleUrl: './ayuda-preguntas.css',
})
export class AyudaPreguntas {
@Input() rol: string | null = null;
}
