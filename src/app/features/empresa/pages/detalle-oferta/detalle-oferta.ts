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
import { ActivatedRoute } from '@angular/router';
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

@Component({
  standalone: true,
  imports: [
   TagModule, CardModule, DividerModule, ToastModule, CommonModule,
    DialogModule, TableModule, Select,      
    Textarea,
    FormsModule, ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './detalle-oferta.html',
})
export class DetalleOferta implements OnInit {
  oferta: any;
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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.cargarDetalle(id);
      this.cargarEstados();
    }
  }
getCandidatoElegido() {
    if (!this.oferta?.candidatoAsignado) return null;
    return this.candidatosPrueba.find(c => c.id === this.oferta.candidatoAsignado);
  }
  cargarDetalle(id: number) {
    this.ofertasService.getDetalleOferta(id).subscribe({
      next: (res) => {
        this.oferta = res.data;
        this.cargando = false;
        // Una vez tenemos la oferta, probamos a traer candidatos
        this.probarCargaCandidatos(id);
       if (this.oferta.estado.toLowerCase() === 'abierta') {
        this.obtenerSugeridos(id);
      }
      },
      error: (err) => {
        console.error('Error al cargar detalle:', err);
        this.cargando = false;
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
        // También puedes avisar si algo sale mal
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo inscribir al candidato',
        });
      },
    });
  }
// Método para cuando la empresa elige a un candidato de la tabla
asignarElegido(candidatoId: number) {
  this.ofertasService.asignarCandidato(this.oferta.id, candidatoId).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Candidato Asignado', detail: res.mensaje });
      this.cargarDetalle(this.oferta.id); // Refrescamos para que desaparezcan botones y cambie el Tag a "Cerrada"
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje || 'No se pudo asignar' });
    }
  });
}

// Método para cerrar la oferta sin elegir a nadie (botón en la cabecera)
finalizarProceso() {
  this.ofertasService.cerrarOferta(this.oferta.id).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'warn', summary: 'Proceso Cerrado', detail: res.mensaje });
      this.cargarDetalle(this.oferta.id);
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cerrar la oferta' });
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
    next: () => {
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Guardado', 
        detail: 'Información de seguimiento actualizada' 
      });
      // Refrescamos la lista de candidatos para que el Chip de la tabla cambie de color
      this.probarCargaCandidatos(this.oferta.id);
    },
    error: (err) => {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudieron guardar los cambios' 
      });
    }
  });
}

getNombreEstado(id: number): string {
  // Si no hay estados cargados aún
  if (!this.estados || this.estados.length === 0) return 'Cargando...';
  
  // Buscamos el estado. Usamos == por si el id viene como string
  const estado = this.estados.find(e => e.id == id);
  return estado ? estado.nombre : 'Inscrito'; // 'Inscrito' por defecto si es id 1 o no se encuentra
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
    default: return 'secondary';
  }
}
}
