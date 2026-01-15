import {
  CandidatoCompleto,
  CandidatoElegible,
  CandidatoResumen,
  OfertaDetalle,
} from './../../../../api/models/Ofertas/ofertasResponse';
import { OfertasService } from './../../../../services/Ofertas/ofertas';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ButtonModule,
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

    // 3. Tipado explícito en el subscribe para evitar el error
    this.ofertasService.getDetalleCandidato(ofertaId, candidatoId).subscribe({
      next: (res) => {
        // res aquí ya viene tipado por el servicio
        console.log('REVISANDO RES:', res); // Mira si aquí ya vienen los datos directos o dentro de .data
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
      next: (res) => {
        // Al ser un array directo [], lo asignamos tal cual
        this.candidatosElegibles = res;
        this.cargandoElegibles = false;
      },
      error: (err) => {
        console.error('Error al traer sugeridos:', err);
        this.cargandoElegibles = false;
      },
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
  getSeverity(estado: string | undefined) {
    if (!estado) return 'info';
    return estado.toLowerCase() === 'abierta' ? 'success' : 'danger';
  }
}
