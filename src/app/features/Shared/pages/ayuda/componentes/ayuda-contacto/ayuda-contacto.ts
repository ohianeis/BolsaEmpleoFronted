import { Component } from '@angular/core';

@Component({
  selector: 'app-ayuda-contacto',
  imports: [],
  templateUrl: './ayuda-contacto.html',
  styleUrl: './ayuda-contacto.css',
})
export class AyudaContacto {
 protected readonly titulo='¿Aún tienes dudas?';
 protected readonly subtitulo='Nuestro equipo está disponible para ayudarte';
 protected readonly textoBoton='Contacta con el Centro';
}
