import { PaginatorModule } from 'primeng/paginator';

import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OfertasService } from '../../../../services/Ofertas/ofertas';

import { Oferta } from '../../../../api/models/Ofertas/ofertasResponse';
import { RouterLink } from '@angular/router';
import { Tab, TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { PaginatedData } from '../../../../api/models/apiResponse';

interface MisOfertasResponse extends PaginatedData<Oferta> {
  counts: {
    abiertas: number;
    cerradas: number;
  };
}
@Component({
  selector: 'app-mis.ofertas',
  standalone: true,
   imports: [RouterLink,TabsModule,CommonModule,PaginatorModule,TagModule,ButtonModule,ToastModule,SkeletonModule],
   providers: [MessageService],
  templateUrl: './mis-ofertas.html',
  styleUrl: './mis-ofertas.css',
})
export class MisOfertas {
// Inicializamos el array para evitar errores en el HTML
listadoOfertas: Oferta[] = [];
cargando:boolean=true;
// varibles paginacion
  totalRecords: number = 0;     
  rows: number = 10;         
  currentPage: number = 1;     
  estadoActual: string = 'abierta';
  countAbiertas: number = 0;
countCerradas: number = 0;
  // Estas son las listas filtradas que usaremos en el HTML
 

//errroes validacion crear oferta

  constructor(private ofertasService: OfertasService,private messageService: MessageService) {}

  ngOnInit() {
    this.obtenerOfertas();
  }

obtenerOfertas(page: number = 0) {
    this.cargando = true;
    
    this.ofertasService.getOfertasEmpresa(page, this.rows, this.estadoActual).subscribe({
      next: (res) => {
        const response = res as any;

        if ( response.data) {
          this.listadoOfertas = response.data.data; // Aquí vienen las 10 de la página actual
          this.totalRecords = response.data.total;
          this.currentPage = response.data.current_page - 1; // Sincronizamos con el paginador (base 0)

          
        }
        if(response.counts){
          console.log('Contadores reales:', response.counts);
          this.countAbiertas = response.counts.abiertas;
          this.countCerradas = response.counts.cerradas;
        } else {
          console.error('El objeto counts no llegó en la raíz del JSON');
        
        }
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al cargar ofertas:', err);
      }
    });
  }
  // Al cambiar de pestaña en PrimeNG
  onTabChange(index: any) {
    this.estadoActual = (index === 0) ? 'abierta' : 'cerrada';
    this.obtenerOfertas(0); // Reset a página 1 al cambiar de pestaña
  }
  onPageChange(event: any) {
  // PrimeNG calcula el primer registro. Dividimos por filas para obtener la página
  const nextPage = (event.first / event.rows);
  this.rows = event.rows; // Actualizamos por si el usuario cambió el "filas por página"
  this.obtenerOfertas(nextPage);
}
}


