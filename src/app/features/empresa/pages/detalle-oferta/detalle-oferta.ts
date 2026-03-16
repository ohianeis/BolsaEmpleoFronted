type TagSeverity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | null
  | undefined;
import {
  CandidatoCompleto,
  CandidatoElegible,
  CandidatoResumen,
  EstadoCandidato,
  OfertaDetalle,
} from './../../../../api/models/Ofertas/ofertasResponse';
import { OfertasService } from './../../../../services/Ofertas/ofertas';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DetalleMotivo, Motivo } from '../../../../api/models/MotivoCierreOferta/motivoCierreResponse';
import { CierreOferta } from '../../../../services/MotivosCierreOferta/cierre-oferta';
import { PaginatorModule } from 'primeng/paginator';
import { CvGestion } from '../../../../services/CV/cv-gestion';
import { Cv } from '../../../../api/models/CV/CvResponse';

@Component({
  standalone: true,
  imports: [
    TagModule,
    CardModule,
    DividerModule,
    ToastModule,
    CommonModule,
    DialogModule,
    TableModule,
    Select,
    PaginatorModule,
    DrawerModule,
    TooltipModule,
    Textarea,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    RouterLink
],
  providers: [MessageService],
  templateUrl: './detalle-oferta.html',
})
export class DetalleOferta implements OnInit {
 oferta: OfertaDetalle = {
  id: 0,
  nombre: '',
  incorporacion: '',
  esAnonima: false, // Valor inicial
  observacion: '',
  tipoContrato: '',
  horario: '',
  nPuestos: 0,
  estado: '',
  fechaCierre: null,
  motivo: '',
  titulos: [],
  demandantesInscritos: 0,
  created_at: ''
};
public estadoOferta:boolean=true;

  cargando: boolean = true;

  //variables para carga candidatos
  candidatosPrueba: CandidatoResumen[] = [];
  cargandoCandidatos: boolean = false;
  //variables para carga perfil completo en dialog
  displayPerfil: boolean = false;
  perfilCandidato?: CandidatoCompleto;
  cargandoPerfil: boolean = false;
// Variables  para control de paginación
totalRecordsInscritos: number = 0;
rowsTable: number = 5; // Cantidad de filas por página por defecto
// Variables para control de paginación de sugeridos tarjetas
totalRecordsSugeridos: number = 0;
rowsSugeridos: number = 6; // Tu "número mágico" para las 2 filas de 3
paginaActualSugeridos: number = 1;
  // Sugeridos (NUEVO)
  candidatosElegibles: CandidatoElegible[] = [];
  cargandoElegibles: boolean = false;
  //variable para controlar que dialog muestro, para poner boton inscribir a candidato sugerido
  mostrarBotonInscribir: boolean = false;
  //variabel para cargar estados
  estados: EstadoCandidato[] = [];
// NUEVAS VARIABLES PARA EL CIERRE
motivosPrincipales: Motivo[] = [];
  displayCierre: boolean = false;

  tipoMotivoSeleccionado: number | null = null;
  detallesCierre: DetalleMotivo[] = [];
  detalleSeleccionadoId: number | null = null;
  enviandoCierre: boolean = false;
  //variable cv
  cvCandidato: Cv | null = null;
  private cierreService=inject(CierreOferta);
  private cvService = inject(CvGestion);

  constructor(
    private route: ActivatedRoute,
    private ofertasService: OfertasService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);

      this.ofertasService.getEstadosCandidato().subscribe((res) => {
        this.estados = res.data ?? [];
        this.cargarDetalle(id); // Esto asegura que ya hay estados cuando se pinte la tabla
      });
    }
  }
  // Añade este método en tu clase DetalleOferta
 cambiarAnonimato() {
  if (!this.oferta?.id) return;

  console.log('Valor antes del cambio:', this.oferta.esAnonima);

  this.ofertasService.toggleAnonimato(this.oferta.id).subscribe({
    next: (res) => {
      // 1. Cambiamos la variable del botón
      this.estadoOferta = !this.estadoOferta;

      // 2. IMPORTANTE: Cambiamos también la propiedad del objeto oferta
      // Esto hará que el @if (oferta.esAnonima) de arriba se actualice al instante
      this.oferta.esAnonima = this.estadoOferta;

      // 3. Tip de Angular: A veces los objetos necesitan un "empujón" para refrescar la vista
      this.oferta = { ...this.oferta };

      this.messageService.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'La visibilidad ha cambiado'
      });
    }
  });
}
  getCandidatoElegido() {
    if (!this.oferta?.candidatoAsignado) return null;
    return this.candidatosPrueba.find((c) => c.id === this.oferta.candidatoAsignado);
  }
  cargarDetalle(id: number) {
    this.ofertasService.getDetalleOferta(id).subscribe({
      next: (res) => {
        this.oferta = res.data ?? ({} as OfertaDetalle);
        this.cargando = false;
  this.estadoOferta = this.oferta.esAnonima ? true : false;
        this.probarCargaCandidatos(id);
        if (this.oferta.estado.toLowerCase() === 'abierta') {
          this.obtenerSugeridos(id);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al acceder',
          detail: err.error?.message || 'No se pudo obtener la información de la oferta',
        });
        //mandar al listado despues de un 2.5 s
        if (err.status === 404 || err.status === 403) {
          setTimeout(() => this.router.navigate(['/empresa/mis-ofertas']), 2500);
        }
      },
    });
  }

 probarCargaCandidatos(id: number, page: number = 1) {
  this.cargandoCandidatos = true;

  // Pasamos id, página actual y filas por página
  this.ofertasService.getCandidatosInscritos(id, page, this.rowsTable).subscribe({
    next: (res: any) => {
      // Como ahora recibimos ApiPaginatedResponse:
      this.candidatosPrueba = res.data?.data ?? []; 
      this.totalRecordsInscritos = res.data?.total ?? 0;
      this.cargandoCandidatos = false;
    },
    error: (err) => {
      console.error(' ERROR AL TRAER CANDIDATOS:', err);
      this.cargandoCandidatos = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'No se pudo cargar la lista de candidatos',
      });
    },
  });
}

// Nuevo método para capturar el cambio de página de la tabla
onPageTableChange(event: any) {
  // PrimeNG envía 'first' (índice del primer registro) y 'rows'
  const page = (event.first / event.rows) + 1;
  this.rowsTable = event.rows;
  
  if (this.oferta?.id) {
    this.probarCargaCandidatos(this.oferta.id, page);
  }
}
  verPerfil(candidatoId: number, esSugerido: boolean = false) {
    this.mostrarBotonInscribir = esSugerido;
    // 1. Limpieza inicial
    this.perfilCandidato = undefined;
    this.displayPerfil = true;
    this.cargandoPerfil = true;
    this.cvCandidato = null;

    // 2. Control de seguridad para el ID de oferta
    const ofertaId = this.oferta?.id;
    if (!ofertaId) {
      console.error('No se pudo encontrar el ID de la oferta');
      this.cargandoPerfil = false;
      return;
    }

    if (!esSugerido) {
      // Buscamos al candidato en nuestra lista local para ver si ya estaba revisado
      const candidatoLocal = this.candidatosPrueba.find((c) => c.id === candidatoId);

      // Si existe y revisado es false (o 0), notificamos al servidor
      if (
        candidatoLocal &&
        (!candidatoLocal.revisado || candidatoLocal.estado_candidato_id === 1)
      ) {
        const datosActualizacion = {
          revisado: true,
          estado_candidato_id: 2, // <--- ID de "Visto"
        };

        this.ofertasService
          .actualizarSeguimiento(ofertaId, candidatoId, datosActualizacion)
          .subscribe({
            next: () => {
              candidatoLocal.revisado = true;
              candidatoLocal.estado_candidato_id = 2; // Actualizamos la tabla
              this.candidatosPrueba = [...this.candidatosPrueba];
              console.log(`Candidato ${candidatoId} marcado como Visto`);
            },
          });
      }
    }
    
    
    // ------------------------------------------

    // Carga normal del perfil detallado
    this.ofertasService.getDetalleCandidato(ofertaId, candidatoId).subscribe({
      next: (res) => {
        this.perfilCandidato = res.data;
        this.cargandoPerfil = false;
           this.cargarCvDelCandidato(ofertaId, candidatoId);
      },
      error: (err) => {
        console.error('Error al obtener el perfil:', err);
        this.cargandoPerfil = false;
        this.perfilCandidato = undefined;
     
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar perfil',
          detail: err.error?.message || 'No se pudo obtener la información del candidato',
        });
      },
    });
  }
  private cargarCvDelCandidato(ofertaId: number, candidatoId: number) {
  this.cvService.verCvCandidato(ofertaId, candidatoId).subscribe({
    next: (res) => {
      this.cvCandidato = res.data || null;
    },
    error: () => {
      this.cvCandidato = null; // Si no tiene o no hay permiso, simplemente no se muestra
    }
  });
}
  // Obtiene los candidatos que no están inscritos pero cumplen requisitos
obtenerSugeridos(idOferta: number, page: number = 1) {
    this.cargandoElegibles = true;
    this.paginaActualSugeridos = page;

    // Llamamos al servicio pasando la página y el límite de 6
    this.ofertasService.getNoInscritos(idOferta, page, this.rowsSugeridos).subscribe({
        next: (res: any) => {
            // Laravel envía la data dentro de res.data (donde está el objeto paginado)
            // res.data.data es el array de candidatos
            this.candidatosElegibles = res.data?.data ?? [];
            this.totalRecordsSugeridos = res.data?.total ?? 0;
            
            this.cargandoElegibles = false;
        },
        error: (err) => {
            console.error('Error al traer sugeridos:', err);
            this.cargandoElegibles = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar las sugerencias'
            });
        },
    });
}

// Nuevo método para capturar el cambio de página en las tarjetas
onPageSugeridosChange(event: any) {
    // PrimeNG usa índice 0 para las páginas, Laravel usa índice 1
    const page = event.page + 1;
    if (this.oferta?.id) {
        this.obtenerSugeridos(this.oferta.id, page);
    }
  }
  // Inscribe a un candidato sugerido en la oferta actual
  vincularCandidato(candidatoId: number) {
    const ofertaId = this.oferta?.id;
    if (!ofertaId) return;

    this.ofertasService.inscribirCandidato(ofertaId, candidatoId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Completado!',
          detail: res.mensaje || 'Candidato añadido correctamente',
          life: 3000, // Dura 3 segundos
        });
        console.log(res.mensaje);

        // 1. Quitamos al candidato de la lista de sugeridos (abajo)
        this.candidatosElegibles = this.candidatosElegibles.filter((c) => c.id !== candidatoId);

        // 2. Refrescamos la tabla de inscritos (arriba) para que aparezca allí
        this.probarCargaCandidatos(ofertaId);

        // 3. Actualizamos el contador visual de la oferta
        if (this.oferta) {
          this.oferta.demandantesInscritos++;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo inscribir al candidato',
        });
      },
    });
  }
  // Método para cuando la empresa elige a un candidato de la tabla
  asignarElegido(candidatoId: number) {
    this.ofertasService.asignarCandidato(this.oferta.id, candidatoId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Candidato Asignado',
          detail: res.message,
        });
        this.cargarDetalle(this.oferta.id); // Refrescamos para que desaparezcan botones y cambie el Tag a "Cerrada"
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo asignar el candidato',
        });
      },
    });
  }

  // Método para cerrar la oferta sin elegir a nadie (botón en la cabecera)
finalizarProceso() {
  this.displayCierre = true;
  this.detalleSeleccionadoId = null; // Reset
  this.detallesCierre = [];
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
  //  Cargar detalles cuando cambie el primer select para cerrar oferta
  onTipoMotivoChange(idMotivo: number) {
    this.tipoMotivoSeleccionado = idMotivo;
    this.detalleSeleccionadoId = null;
    this.detallesCierre = [];

    this.cierreService.getDetallesActivos().subscribe({
      next: (res) => {
        this.detallesCierre = res.data ?? [];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los detalles' });
      }
    });
  }
  //confiramr cierre
  confirmarCierreDefinitivo() {
    if (!this.detalleSeleccionadoId) return;

    this.enviandoCierre = true;
    
    // Llamamos al método cerrarOferta del servicio original, pero ahora pasando el ID del detalle
    // Nota: Asegúrate de que el método cerrarOferta de tu OfertasService acepte el body { detalle_motivo_id }
    this.ofertasService.cerrarOferta(this.oferta.id, this.detalleSeleccionadoId).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Oferta Cerrada',
          detail: 'El proceso ha finalizado correctamente'
        });
        this.displayCierre = false;
        this.enviandoCierre = false;
        this.cargarDetalle(this.oferta.id); // Recargamos para ver estado "Cerrada"
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
  //ver el candidato que ha sido asignado en la oferta cerrada si esque lo hay
  getSeverity(estado: string | undefined): TagSeverity {
    if (!estado) return 'secondary';

    switch (estado.toLowerCase()) {
      case 'abierta':
        return 'success';
      case 'cerrada':
        return 'danger';
      case 'en proceso':
        return 'warn';
      default:
        return 'secondary';
    }
  }
  //cargar estados por los que puede pasar un candidato en una oferta de trabajo
  cargarEstados() {
    this.ofertasService.getEstadosCandidato().subscribe({
      next: (res) => {
        if (res && res.data) {
          // Filtrarpara que no aparezca "Visto"
          this.estados = res.data.filter(
            (e: any) => e.nombre.toLowerCase() !== 'visto' && e.id !== 2,
          );
        }
      },
    });
  }
  guardarSeguimiento() {
    if (!this.perfilCandidato || !this.oferta) return;

    const datos = {
      estado_candidato_id: this.perfilCandidato.estado_candidato_id,
      notas_reclutador: this.perfilCandidato.notas_reclutador,
      revisado: true, // Lo marcamos como revisado siempre que se toque algo
    };

    this.ofertasService
      .actualizarSeguimiento(this.oferta.id, this.perfilCandidato.id, datos)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: res.message || 'Seguimiento guardado correctamente',
          });
          // Refrescamos la lista de candidatos para que el Chip de la tabla cambie de color
          this.probarCargaCandidatos(this.oferta.id);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Error al guardar el seguimiento',
          });
        },
      });
  }

  getNombreEstado(id: any): string {
    if (!id || !this.estados || this.estados.length === 0) {
      return 'Cargando...'; // Evita poner "Inscrito" por error mientras carga
    }

    // Forzar que ambos sean números para la comparación
    const estado = this.estados.find((e) => Number(e.id) === Number(id));

    return estado ? estado.nombre : 'Inscrito';
  }

  getSeverityEstado(id: number): TagSeverity {
    // Convertimos a número por seguridad
    const estadoId = Number(id);

    switch (estadoId) {
      case 1:
        return 'info'; // Inscrito (Azul)
      case 2:
        return 'secondary'; // Visto (Gris)
      case 3:
        return 'warn'; // Entrevista telefónica (Naranja)
      case 4:
        return 'warn'; // Entrevista presencial (Naranja)
      case 5:
        return 'success'; // Prueba técnica (Verde suave)
      case 6:
        return 'danger'; // Descartado (Rojo)
      case 7:
        return 'success'; // Seleccionado (Verde fuerte)
      case 8:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
