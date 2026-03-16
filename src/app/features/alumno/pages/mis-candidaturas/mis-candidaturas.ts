import { DemandanteService } from './../../../../services/Ofertas/Demandantes/DemandanteService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { MessageService } from 'primeng/api';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Drawer } from 'primeng/drawer';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DetalleOfertaDemandante } from '../../../../api/models/Demandantes/demantantesResponse';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatedData } from '../../../../api/models/apiResponse';

interface MisInscripcionesResponse extends PaginatedData<DetalleOfertaDemandante> {
  stats: {
    activas: number;
    conseguidas: number;
    retiradas: number;
    finalizadas:number;
  };
}
@Component({
  selector: 'app-mis-candidaturas',
  standalone: true,
  imports: [CommonModule,ConfirmDialogModule,PaginatorModule, RouterModule, Skeleton, Tag, ButtonModule, Toast, Drawer,TabsModule,TooltipModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './mis-candidaturas.html'
})
export class MisCandidaturas implements OnInit {
  candidaturas: DetalleOfertaDemandante[] = [];
  loading: boolean = true;
  tabActual: string = 'activas';
  displayDetalle: boolean = false;
  seleccionada: any = null;
  // variables paginacion
  totalRecords: number = 0;
  rows: number = 10;
  currentPage: number = 0; // PrimeNG usa índice 0, Laravel usa 1
  //variables cabecera ptabs
  totalesCandidaturas = {
  activas: 0,
  conseguidas: 0,
  retiradas: 0,
  finalizadas:0
};
//controlar el expansion
ofertaExpandidaId: number | null = null;
  constructor(
    private ofertaService: DemandanteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService 
  ) {}

  ngOnInit(): void {
    this.cargarCandidaturas();
  }

cargarCandidaturas(page: number = 1) {
  this.loading = true;
  
  // LOG DE CONTROL: Si este log no sale en consola, el problema es la llamada a la función
  console.log(`Pidiendo al servidor: Page=${page}, Tab=${this.tabActual}`);

  this.ofertaService.getMisInscripciones(page, this.tabActual).subscribe({
    next: (res) => {
      console.log('Respuesta del servidor recibida:', res);
      if (res.data) {
        this.candidaturas = res.data.data;
        this.totalRecords = res.data.total;
        this.rows = res.data.per_page;

        // Mapeo de estadísticas
        const datosStats = res.data as any; // Usamos any temporalmente para evitar líos de tipos
        if (datosStats.stats) {
          this.totalesCandidaturas = {
            activas: datosStats.stats.activas || 0,
            conseguidas: datosStats.stats.conseguidas || 0,
            retiradas: datosStats.stats.retiradas || 0,
            finalizadas: datosStats.stats.finalizadas || 0
          };
        }
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error en el Network:', err);
      this.loading = false;
    }
  });
}
onTabChange(event: any) {
  console.log('onTabChange disparado:', event);
  const valor = event.value || event;
  if (valor && typeof valor === 'string') {
    this.ejecutarCambioTab(valor);
  }
}

// 2. Función de respaldo para el click manual
forzarCarga(tab: string) {
  console.log('Click manual en tab:', tab);
  if (this.tabActual !== tab) {
    this.tabActual = tab;
    this.ejecutarCambioTab(tab);
  }
}

// 3. Lógica común de limpieza y carga
public ejecutarCambioTab(tab: any) {
  console.log('Intentando cargar tab:', tab);
  
  // 1. Sincronizamos variables
  this.tabActual = tab; 
  this.candidaturas = []; 
  this.currentPage = 0;   
  this.loading = true;    

  // 2. IMPORTANTE: Forzar la ejecución de la consulta
  // Llamamos a cargarCandidaturas con la página 1 explícitamente
  this.cargarCandidaturas(1);
}
  // MÉTODO PARA CAMBIAR DE PÁGINA
  onPageChange(event: any) {
    // event.page es el índice de página (0, 1, 2...)
    // Laravel espera (1, 2, 3...)
    this.currentPage = event.page;
    this.cargarCandidaturas(event.page + 1);
    
    // Scroll arriba suave para que el usuario vea los nuevos resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }




  verDetalle(oferta: any) {
    this.seleccionada = oferta;
    this.displayDetalle = true;
  }


  confirmarDesapuntarse(idOferta: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres retirar tu candidatura? Esta acción no se puede deshacer.',
      header: 'Confirmar Retirada',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, desapuntarme',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-text p-button-secondary p-button-sm',
      accept: () => {
        this.ejecutarDesapuntarse(idOferta);
      }
    });
  }

  private ejecutarDesapuntarse(id: number) {
    this.ofertaService.desapuntarse(id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Candidatura retirada',
          detail: 'Te has desapuntado de la oferta correctamente.'
        });
       this.cargarCandidaturas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo procesar la solicitud.'
        });
      }
    });
  }
  
reInscribirse(idOferta: number) {
  // 1. Buscamos la oferta en nuestro array local
  const oferta = this.candidaturas.find(c => c.id === idOferta);

  // 2. Validamos el estado antes de llamar al servicio
  if (oferta?.estado?.toLowerCase() !== 'abierta') {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acción no permitida',
      detail: 'La oferta ha sido cerrada y no admite nuevas inscripciones.'
    });
    return;
  }

  // 3. Si está abierta, procedemos con la inscripción
  this.ofertaService.inscribirse(idOferta).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success',
        summary: '¡Inscripción reactivada!',
        detail: 'Te has vuelto a apuntar a la oferta con éxito.'
      });
      this.cargarCandidaturas();
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'No se pudo reactivar la candidatura.'
      });
    }
  });
}
//pulsar el expandir tarjeta para mas info
toggleExpandir(id: number) {
  this.ofertaExpandidaId = this.ofertaExpandidaId === id ? null : id;
}


 getSeverityCandidato(estado: string | undefined): "success" | "info" | "warn" | "danger" | "secondary" {
  const e = estado?.toLowerCase() || '';
  if (e.includes('inscrito') || e.includes('enviada')) return 'info';
 if (e.includes('desapuntado') || e.includes('retirada')) return 'secondary';
  if (e.includes('visto') || e.includes('proceso')) return 'warn';
  if (e.includes('entrevista') || e.includes('seleccionado')) return 'success';
  if (e.includes('descartado') || e.includes('rechazado')) return 'danger';
  return 'secondary';
}

getIconCandidato(estado: string | undefined): string {
  const e = estado?.toLowerCase() || '';
  if (e.includes('inscrito')) return 'pi-send text-blue-500';
  if (e.includes('visto')) return 'pi-eye text-orange-500';
  if (e.includes('entrevista')) return 'pi-phone text-purple-500';
  if (e.includes('seleccionado')) return 'pi-check-circle text-green-500';
  if (e.includes('descartado')) return 'pi-times-circle text-red-500';
  return 'pi-info-circle text-slate-400';
}

getBgColorCandidato(estado: string | undefined): string {
  const e = estado?.toLowerCase() || '';
  if (e.includes('inscrito')) return 'bg-blue-50';
  if (e.includes('visto')) return 'bg-orange-50';
  if (e.includes('entrevista')) return 'bg-purple-50';
  if (e.includes('seleccionado')) return 'bg-green-50';
  if (e.includes('descartado')) return 'bg-red-50';
  return 'bg-slate-50';
}
}