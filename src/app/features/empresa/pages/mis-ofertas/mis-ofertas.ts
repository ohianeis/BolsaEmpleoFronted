
import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OfertasService } from '../../../../services/Ofertas/ofertas';
import { DatePipe } from '@angular/common';
import { Oferta } from '../../../../api/models/Ofertas/ofertasResponse';
import { RouterLink } from '@angular/router';
import { Tab, TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mis.ofertas',
  standalone: true,
   imports: [DatePipe,RouterLink,TabsModule,ButtonModule],
  templateUrl: './mis-ofertas.html',
  styleUrl: './mis-ofertas.css',
})
export class MisOfertas {
// Inicializamos el array para evitar errores en el HTML
listadoOfertas: Oferta[] = [];
cargando:boolean=true;
  
  // Estas son las listas filtradas que usaremos en el HTML
  ofertasAbiertas: Oferta[] = [];
  ofertasCerradas: Oferta[] = [];


  constructor(private ofertasService: OfertasService) {}

  ngOnInit() {
    this.obtenerOfertas();
  }

obtenerOfertas() {
  this.cargando=true;
  this.ofertasService.getOfertasEmpresa().subscribe({
    next: (response: any) => { 
      // 1. Extraemos los datos reales
      // Si response es un array, lo usamos. Si tiene .data, usamos .data
      const dataExtraida = Array.isArray(response) ? response : response.data;

      if (dataExtraida) {
        this.listadoOfertas = dataExtraida; // Aquí ya no dará error de tipo

        // 2. Filtramos para las pestañas
        this.ofertasAbiertas = this.listadoOfertas.filter(o => o.estado_id === 'Abierta');
        this.ofertasCerradas = this.listadoOfertas.filter(o => o.estado_id === 'Cerrada');
        this.cargando=false;
        console.log('Ofertas procesadas correctamente',this.ofertasAbiertas);
      }
    },
    error: (err) => console.error('Error al cargar:', err)
  });
  }
}

