import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 // isFullWidthPage = false;
  protected readonly title = signal('BolsaEmpleoFronted');
/*  constructor(private router: Router) {
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe((event: any) => {
    // Definimos qué rutas NO llevan el margen del panel (Login, Registro, Ayuda externa...)
    const fullWidthRoutes = ['/login', '/registro', '/auth/cambiar-password'];
    this.isFullWidthPage = fullWidthRoutes.includes(event.urlAfterRedirects);
  });
}*/
}
