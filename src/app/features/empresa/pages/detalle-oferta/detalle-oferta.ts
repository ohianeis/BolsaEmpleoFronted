import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Tus Componentes Hijos


// Tus Modelos e Interfaces
import { 
  CandidatoCompleto, 
  CandidatoElegible, 
  CandidatoResumen, 
  EstadoCandidato, 
  OfertaDetalle 
} from '../../../../api/models/Ofertas/ofertasResponse';
import { DetalleMotivo } from '../../../../api/models/MotivoCierreOferta/motivoCierreResponse';
import { Cv } from '../../../../api/models/CV/CvResponse';

// Tus Servicios
import { OfertasService } from '../../../../services/Ofertas/ofertas';
import { CvGestion } from '../../../../services/CV/cv-gestion';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CandidatoPerfil } from './candidato-perfil/candidato-perfil';
import { CierreOfertaDialog } from './cierre-oferta/cierre-oferta';
import { CierreOferta } from '../../../../services/MotivosCierreOferta/cierre-oferta';


@Component({
  selector: 'app-detalle-oferta',
  standalone: true,
  imports: [
    TagModule,
    CardModule,
    DividerModule,
    ToastModule,
    CommonModule,
    DialogModule,
    TableModule,
    PaginatorModule,
    DrawerModule,
    TooltipModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    RouterLink,
    CandidatoPerfil,CierreOfertaDialog
],
  providers: [MessageService],
  templateUrl: './detalle-oferta.html',
})
export class DetalleOferta implements OnInit {
  // Inyectores
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ofertasService = inject(OfertasService);
  private messageService = inject(MessageService);
  private cvService = inject(CvGestion);
  // Añade esto en los inyectores del padre
private cierreService = inject(CierreOferta); // Asegúrate de importar el servicio arriba
cargando = true;           
cargandoSugeridos = false;
  // Estado de la Oferta
  oferta?: OfertaDetalle;
  idOferta!: number;
  estados: EstadoCandidato[] = [];
  detallesCierre: DetalleMotivo[] = [];

  // Listados
  candidatosInscritos: CandidatoResumen[] = [];
  candidatosSugeridos: CandidatoElegible[] = [];
  
  // Paginación y UI
  totalRecordsInscritos = 0;
  rowsTable = 5;
  cargandoCandidatos = false;
  cargandoPerfil = false;
  enviandoCierre = false;
  displayPerfil = false;
  displayCierre = false;
  mostrarBotonInscribir = false;

  //paginacion cards
  // Variables para controlar la paginación de sugeridos
totalRecordSugeridos = 0;
paginaSugeridos = 0;
rowsSugeridos = 6;
  // cierreOFERTA
  

  // Datos para Hijos
  perfilCandidato?: CandidatoCompleto;
  cvCandidato: Cv | null = null;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idOferta = Number(idParam);
      this.cargarInicial();
    }
  }

  cargarInicial() {
    // 1. Cargar Estados primero
    this.ofertasService.getEstadosCandidato().subscribe(res => {
      this.estados = res.data ?? [];
      // 2. Cargar Detalle de Oferta
      this.cargarDetalleOferta();
    });
  }

  cargarDetalleOferta() {
    this.ofertasService.getDetalleOferta(this.idOferta).subscribe({
      next: (res) => {
        this.oferta = res.data;
        this.probarCargaCandidatos(0);
        if (this.oferta?.estado.toLowerCase() === 'abierta') {
          this.obtenerSugeridos(0);
        }
        this.cargando = false; 
      },
    error: (err) => {
      console.error(err);
      this.cargando = false; 
    }
  });
   
   
  }

  probarCargaCandidatos(page: number) {
    this.cargandoCandidatos = true;
    this.ofertasService.getCandidatosInscritos(this.idOferta, page, this.rowsTable).subscribe({
      next: (res: any) => {
        this.candidatosInscritos = res.data?.data ?? [];
        this.totalRecordsInscritos = res.data?.total ?? 0;
        this.cargandoCandidatos = false;
      }
    });
  }

  // Evento desde app-candidatos-tabla
  onPageTableChange(event: any) {
    const page = event.first / event.rows;
    this.rowsTable = event.rows;
    this.probarCargaCandidatos(page);
  }

  verPerfil(idCandidato: number, esSugerido: boolean = false) {
    this.mostrarBotonInscribir = esSugerido;
    this.displayPerfil = true;
    this.cargandoPerfil = true;

    this.ofertasService.getDetalleCandidato(this.idOferta, idCandidato).subscribe({
      next: (res) => {
        this.perfilCandidato = res.data;
        this.cargandoPerfil = false;
        this.cargarCv(idCandidato);
      }
    });
  }

  cargarCv(idCandidato: number) {
    this.cvService.verCvCandidato(this.idOferta, idCandidato).subscribe(res => {
      this.cvCandidato = res.data || null;
    });
  }

  guardarSeguimiento() {
    if (!this.perfilCandidato) return;
    const datos = {
      estado_candidato_id: this.perfilCandidato.estado_candidato_id,
      notas_reclutador: this.perfilCandidato.notas_reclutador,
      revisado: true
    };
    this.ofertasService.actualizarSeguimiento(this.idOferta, this.perfilCandidato.id, datos).subscribe(() => {
      this.probarCargaCandidatos(0);
    });
  }

  vincularCandidato(idCandidato: number) {
    this.ofertasService.inscribirCandidato(this.idOferta, idCandidato).subscribe(() => {
      this.displayPerfil = false;
      this.probarCargaCandidatos(0);
      this.obtenerSugeridos(0);
    });
  }

  asignarElegido(idCandidato: number) {
    this.ofertasService.asignarCandidato(this.idOferta, idCandidato).subscribe(() => {
      this.cargarDetalleOferta();
    });
  }
// Método para cerrar la oferta sin elegir a nadie (botón en la cabecera)
finalizarProceso() {
  this.displayCierre = true;
  this.enviandoCierre = false;

  this.cierreService.getDetallesActivos().subscribe({
    next: (res) => {
      this.detallesCierre = res.data ?? [];
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los motivos' });
    }
  });
}

// Cambia 'confirmarCierreDefinitivo' por esto (recibiendo el ID desde el hijo):
confirmarCierreDefinitivo(idMotivo: number) {
  if (!idMotivo || !this.oferta) return; // Seguridad contra undefined

  this.enviandoCierre = true;
  
  this.ofertasService.cerrarOferta(this.oferta.id, idMotivo).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Oferta Cerrada',
        detail: 'El proceso ha finalizado correctamente'
      });
      this.displayCierre = false;
      this.enviandoCierre = false;
      this.cargarDetalleOferta(); 
    },
    error: (err) => {
      this.enviandoCierre = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'No se pudo cerrar la oferta'
      });
    }
  });
}
 abrirDialogoCierre() {
    this.displayCierre = true;
    /** * IMPORTANTE: Si 'getMotivosCierre' no existe en tu OfertasService, 
     * cámbialo por el método que traiga los motivos de tu API.
     */
    this.ofertasService.getEstadosCandidato().subscribe({ 
      next: (res) => {
        // Aquí deberías cargar los motivos reales de cierre. 
        // Si no tienes el método, asegúrate de añadirlo al OfertasService.
        this.detallesCierre = []; 
      }
    });
  }
cambiarAnonimato() {
  if (!this.oferta) return;
  
  // Guardamos el estado anterior por si falla la API (rollback)
  const estadoAnterior = this.oferta.esAnonima;
  this.oferta.esAnonima = !this.oferta.esAnonima;

  this.ofertasService.toggleAnonimato(this.idOferta).subscribe({
    next: () => {
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Actualizado', 
        detail: `La oferta ahora es ${this.oferta?.esAnonima ? 'Anónima' : 'Pública'}` 
      });
    },
    error: () => {
      // Si falla, volvemos atrás
      this.oferta!.esAnonima = estadoAnterior;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el anonimato' });
    }
  });
}

 onPageSugeridosChange(event: any) {
  this.paginaSugeridos = event.first; // PrimeNG paginator da la página directamente
  const page=event.first / event.rows
  console.log('pagina canidatos suguerisod',this.paginaSugeridos);
  this.obtenerSugeridos(page);
}

// Actualiza tu método obtenerSugeridos para capturar el total
obtenerSugeridos(page: number) {
  this.cargandoSugeridos = true; // Activa spinner de sugeridos
  this.ofertasService.getNoInscritos(this.idOferta, page, this.rowsSugeridos).subscribe({
    next: (res: any) => {
      this.candidatosSugeridos = res.data?.data ?? [];
      this.totalRecordSugeridos = res.data?.total ?? 0; // Usamos el nombre que pide el HTML
     const currentPage = res.data?.current_page ?? 1;
      this.paginaSugeridos = (currentPage - 1) * this.rowsSugeridos;
     console.log('pagina despues de llamada sugueridos',this.paginaSugeridos)
      this.cargandoSugeridos = false;
    },
    error: () => this.cargandoSugeridos = false
  });
}
getSeverity(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | undefined {
  switch (estado.toLowerCase()) {
    case 'abierta': return 'success';
    case 'cerrada': return 'danger';
    case 'en proceso': return 'info';
    case 'pendiente': return 'warn';
    default: return 'secondary';
  }
}

// Obtiene el nombre del estado del candidato según su ID
getNombreEstado(id: number): string {
  const estado = this.estados.find(e => e.id === id);
  return estado ? estado.nombre : 'Desconocido';
}

// Define el color del tag del candidato según su fase (ID)
getSeverityEstado(id: number): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
  switch (id) {
    case 1: return 'info';      // Inscrito / Pendiente
    case 2: return 'warn';      // En Revisión
    case 3: return 'info';      // Entrevista
    case 4: return 'success';   // Seleccionado
    case 5: return 'danger';    // Descartado
    case 8: return 'contrast';  // Candidato retirado (Bloqueado)
    default: return 'secondary';
  }
}
}