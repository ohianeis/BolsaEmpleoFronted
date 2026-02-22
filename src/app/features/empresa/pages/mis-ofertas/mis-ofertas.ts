
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

@Component({
  selector: 'app-mis.ofertas',
  standalone: true,
   imports: [RouterLink,TabsModule,CommonModule,TagModule,ButtonModule,ToastModule,SkeletonModule],
   providers: [MessageService],
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

//errroes validacion crear oferta

  constructor(private ofertasService: OfertasService,private messageService: MessageService) {}

  ngOnInit() {
    this.obtenerOfertas();
  }

obtenerOfertas() {
  this.cargando=true;
  this.ofertasService.getOfertasEmpresa().subscribe({
    next: (response: any) => { 
      // 1. Extraemos los datos reales
  
      const dataExtraida = response.data ?? [];

      if (dataExtraida) {
        this.listadoOfertas = dataExtraida;

        // 2. Filtramos para las pestañas
        this.ofertasAbiertas = this.listadoOfertas.filter(o => o.estado_id === 'Abierta');
        this.ofertasCerradas = this.listadoOfertas.filter(o => o.estado_id === 'Cerrada');
        this.cargando=false;
        
      }
    },
   error: (err) => {
      this.cargando = false;
      console.error('Error al cargar:', err);
      console.log('Objeto de error completo:', err);
  console.log('Lo que mandó Laravel (body):', err.error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err.error?.message || 'No se pudieron cargar las ofertas' 
      });
    }
  });
  }
}

