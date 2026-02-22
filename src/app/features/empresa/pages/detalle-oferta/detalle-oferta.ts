type TagSeverity = "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined;
import {
  CandidatoCompleto,
  CandidatoElegible,
  CandidatoResumen,
  EstadoCandidato,
  OfertaDetalle,
} from './../../../../api/models/Ofertas/ofertasResponse';
import { OfertasService } from './../../../../services/Ofertas/ofertas';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
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

@Component({
  standalone: true,
  imports: [
   TagModule, CardModule, DividerModule, ToastModule, CommonModule,
    DialogModule, TableModule, Select, DrawerModule,     
    Textarea,
    FormsModule, ButtonModule,ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './detalle-oferta.html',
})
export class DetalleOferta implements OnInit {
oferta: OfertaDetalle = {} as OfertaDetalle;
  cargando: boolean = true;

  //variables para carga candidatos
  candidatosPrueba: CandidatoResumen[] = [];
  cargandoCandidatos: boolean = false;
  //variables para carga perfil completo en dialog
  displayPerfil: boolean = false;
  perfilCandidato?: CandidatoCompleto;
  cargandoPerfil: boolean = false;

  // Sugeridos (NUEVO)
  candidatosElegibles: CandidatoElegible[] = [];
  cargandoElegibles: boolean = false;
//variable para controlar que dialog muestro, para poner boton inscribir a candidato sugerido
  mostrarBotonInscribir: boolean = false;
  //variabel para cargar estados
  estados:EstadoCandidato[]=[];

  constructor(
    private route: ActivatedRoute,
    private ofertasService: OfertasService,
    private router: Router,
    private messageService: MessageService
  ) {}

ngOnInit() {
  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    const id = Number(idParam);

    this.ofertasService.getEstadosCandidato().subscribe(res => {
      this.estados = res.data ??[];
      this.cargarDetalle(id); // Esto asegura que ya hay estados cuando se pinte la tabla
    });
  }
}
getCandidatoElegido() {
    if (!this.oferta?.candidatoAsignado) return null;
    return this.candidatosPrueba.find(c => c.id === this.oferta.candidatoAsignado);
  }
  cargarDetalle(id: number) {
    this.ofertasService.getDetalleOferta(id).subscribe({
      next: (res) => {
this.oferta = res.data ?? ({} as OfertaDetalle);
        this.cargando = false;
        // Una vez tenemos la oferta, probamos a traer candidatos
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
        detail: err.error?.message || 'No se pudo obtener la información de la oferta' 
      });
      //mandar al listado despues de un 2.5 s
      if (err.status === 404 || err.status === 403) {
        setTimeout(() => this.router.navigate(['/empresa/mis-ofertas']), 2500);
      }
    },
  });
    
      
  
  }

  probarCargaCandidatos(id: number) {
    this.cargandoCandidatos = true;

    this.ofertasService.getCandidatosInscritos(id).subscribe({
      next: (res) => {
        this.candidatosPrueba = res.data ?? [];

        this.cargandoCandidatos = false;
      },
      error: (err) => {
        console.error(' ERROR AL TRAER CANDIDATOS:', err);
        this.cargandoCandidatos = false;
        this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err.error?.message || 'No se pudo cargar la lista de candidatos' 
      });
      },
    });
  }
  verPerfil(candidatoId: number, esSugerido:boolean=false) {
    this.mostrarBotonInscribir=esSugerido;
    // 1. Limpieza inicial
    this.perfilCandidato = undefined;
    this.displayPerfil = true;
    this.cargandoPerfil = true;

    // 2. Control de seguridad para el ID de oferta
    const ofertaId = this.oferta?.id;
    if (!ofertaId) {
      console.error('No se pudo encontrar el ID de la oferta');
      this.cargandoPerfil = false;
      return;
    }

    if (!esSugerido) {
    // Buscamos al candidato en nuestra lista local para ver si ya estaba revisado
    const candidatoLocal = this.candidatosPrueba.find(c => c.id === candidatoId);
    
    // Si existe y revisado es false (o 0), notificamos al servidor
 if (candidatoLocal && (!candidatoLocal.revisado || candidatoLocal.estado_candidato_id === 1)) {
      const datosActualizacion = { 
        revisado: true,
        estado_candidato_id: 2 // <--- ID de "Visto"
      };

      this.ofertasService.actualizarSeguimiento(ofertaId, candidatoId, datosActualizacion).subscribe({
        next: () => {
          candidatoLocal.revisado = true;
          candidatoLocal.estado_candidato_id = 2; // Actualizamos la tabla
          this.candidatosPrueba = [...this.candidatosPrueba];
          console.log(`Candidato ${candidatoId} marcado como Visto`);
        }
      });
    }
  }
  // ------------------------------------------

  // Carga normal del perfil detallado
  this.ofertasService.getDetalleCandidato(ofertaId, candidatoId).subscribe({
    next: (res) => {
      this.perfilCandidato = res.data;
      this.cargandoPerfil = false;
    },
    error: (err) => {
      console.error('Error al obtener el perfil:', err);
      this.cargandoPerfil = false;
      this.perfilCandidato = undefined;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error al cargar perfil', 
        detail: err.error?.message || 'No se pudo obtener la información del candidato' 
      });
    },
  });
}
  // Obtiene los candidatos que no están inscritos pero cumplen requisitos
  obtenerSugeridos(idOferta: number) {
  this.cargandoElegibles = true;
  this.ofertasService.getNoInscritos(idOferta).subscribe({
    next: (res: any) => {
      // LOGS DE CONTROL
      console.log('Respuesta cruda de la API:', res);

      // Si la API devuelve el array directo (como ves en Network)
      if (Array.isArray(res)) {
        this.candidatosElegibles = res;
      } 
      // Por si acaso en algún momento cambia a objeto con .data
      else if (res && res.data && Array.isArray(res.data)) {
        this.candidatosElegibles = res.data;
      } 
      else {
        this.candidatosElegibles = [];
      }

      console.log('Variable candidatosElegibles después de asignar:', this.candidatosElegibles);
      this.cargandoElegibles = false;
    },
    error: (err) => {
      console.error('Error al traer sugeridos:', err);
      this.cargandoElegibles = false;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Sugeridos no disponibles', 
        detail: err.error?.message || 'No se pudieron cargar los candidatos sugeridos' 
      });
    }
  });
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
          detail: err.error?.message || 'No se pudo inscribir al candidato'
        });
      },
    });
  }
// Método para cuando la empresa elige a un candidato de la tabla
asignarElegido(candidatoId: number) {
  this.ofertasService.asignarCandidato(this.oferta.id, candidatoId).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Candidato Asignado', detail: res.message });
      this.cargarDetalle(this.oferta.id); // Refrescamos para que desaparezcan botones y cambie el Tag a "Cerrada"
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo asignar el candidato' });
    }
  });
}

// Método para cerrar la oferta sin elegir a nadie (botón en la cabecera)
finalizarProceso() {
  this.ofertasService.cerrarOferta(this.oferta.id).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Proceso Cerrado', detail: res.message });
      this.cargarDetalle(this.oferta.id);
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error',detail: err.error?.message || 'No se pudo cerrar la oferta'});
    }
  });
}
//ver el candidato que ha sido asignado en la oferta cerrada si esque lo hay
getSeverity(estado: string | undefined): TagSeverity {
  if (!estado) return 'secondary';
  
  switch (estado.toLowerCase()) {
    case 'abierta': return 'success';
    case 'cerrada': return 'danger';
    case 'en proceso': return 'warn';
    default: return 'secondary';
  }
}
  //cargar estados por los que puede pasar un candidato en una oferta de trabajo
cargarEstados() {
  this.ofertasService.getEstadosCandidato().subscribe({
    next: (res) => {
      if (res && res.data) {
        // Filtrarpara que no aparezca "Visto" 
        this.estados = res.data.filter((e: any) => 
          e.nombre.toLowerCase() !== 'visto' && e.id !== 2
        );
      }
    }
  });
}
guardarSeguimiento() {
  if (!this.perfilCandidato || !this.oferta) return;

  const datos = {
    estado_candidato_id: this.perfilCandidato.estado_candidato_id,
    notas_reclutador: this.perfilCandidato.notas_reclutador,
    revisado: true // Lo marcamos como revisado siempre que se toque algo
  };

  this.ofertasService.actualizarSeguimiento(this.oferta.id, this.perfilCandidato.id, datos).subscribe({
    next: (res) => {
    this.messageService.add({ 
        severity: 'success', 
        summary: 'Actualizado', 
        detail: res.message || 'Seguimiento guardado correctamente' 
      });
      // Refrescamos la lista de candidatos para que el Chip de la tabla cambie de color
      this.probarCargaCandidatos(this.oferta.id);
    },
    error: (err) => {
     this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err.error?.message || 'Error al guardar el seguimiento' 
      });
    }
  });
}

getNombreEstado(id: any): string {
  if (!id || !this.estados || this.estados.length === 0) {
    return 'Cargando...'; // Evita poner "Inscrito" por error mientras carga
  }
  
  // Forzar que ambos sean números para la comparación
  const estado = this.estados.find(e => Number(e.id) === Number(id));
  
  return estado ? estado.nombre : 'Inscrito'; 
}

getSeverityEstado(id: number): TagSeverity {
  // Convertimos a número por seguridad
  const estadoId = Number(id);
  
  switch (estadoId) {
    case 1: return 'info';      // Inscrito (Azul)
    case 2: return 'secondary'; // Visto (Gris)
    case 3: return 'warn';      // Entrevista telefónica (Naranja)
    case 4: return 'warn';      // Entrevista presencial (Naranja)
    case 5: return 'success';   // Prueba técnica (Verde suave)
    case 6: return 'danger';    // Descartado (Rojo)
    case 7: return 'success';   // Seleccionado (Verde fuerte)
     case 8: return 'danger';  
    default: return 'secondary';
  }
}
}
