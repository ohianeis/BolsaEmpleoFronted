import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, timer } from 'rxjs';

// PrimeNG (Solo lo necesario para la página padre)
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

// Servicios e Interfaces
import { TitulosService, Titulo } from '../../../../../services/Titulos/titulos';
import { OfertasService } from '../../../../../services/Ofertas/ofertas';
import { Familia } from '../../../../../api/models/Admin/adminModel';
import { OfertaDetalle } from '../../../../../api/models/Ofertas/ofertasResponse';

// El componente hijo reutilizable (Ajusta la ruta si es necesario)
import { FormOferta } from '../form-oferta/form-oferta'; 

@Component({
  selector: 'app-editar-oferta',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule, 
    ToastModule, 
    SkeletonModule, 
    FormOferta 
  ],
  templateUrl: './editar-oferta.html'
})
export class EditarOferta implements OnInit {
  idOferta: number = 0;
  familias: Familia[] = [];
  listaTitulos: Titulo[] = [];
  
  // Datos que le pasaremos al hijo [datosIniciales]
  ofertaCargada: any = null;
  // El booleano que discutimos con Laravel
  estaBloqueada: boolean = false;
  
  cargando: boolean = false;      // Para el botón de guardar
  cargandoDatos: boolean = true;  // Para el Skeleton inicial
  erroresApi: { [key: string]: string[] } = {};

  constructor(
    private route: ActivatedRoute, // Para leer el ID de la URL
    private ofertasService: OfertasService,
    private titulosService: TitulosService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos el ID de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/empresa/mis-ofertas']);
      return;
    }
    this.idOferta = Number(idParam);

    // 2. Cargamos todos los datos necesarios en paralelo
    forkJoin({
      resFamilias: this.titulosService.getFamilias(),
      resTitulos: this.titulosService.getTitulosActivos(),
      resEdicion: this.ofertasService.getDatosEdicion(this.idOferta), // Tu nueva API de edit
      espera: timer(800) 
    }).subscribe({
      next: (res) => {
        // A) Listas para los selectores
        this.familias = res.resFamilias.data || [];
        this.listaTitulos = res.resTitulos.data || [];

        // B) Datos de la oferta específica
        const datosEdicion = res.resEdicion.data;
        if (datosEdicion) {
          this.estaBloqueada = datosEdicion.bloqueado; // Guardamos el estado de bloqueo

          // Mapeamos los datos para que coincidan con la estructura del FormOferta
          this.ofertaCargada = {
            ...datosEdicion.oferta,
            // Convertimos fecha string a objeto Date para el DatePicker
incorporacion: this.parsearFechaEntrada(datosEdicion.oferta.incorporacion),
            // EXTRAEMOS SOLO LOS IDS de los títulos para el MultiSelect
            titulo: datosEdicion.oferta.titulos.map((t: any) => t.id)
          };
        }

        this.cargandoDatos = false;
      },
      error: (err) => {
        this.cargandoDatos = false;
        this.showError('Error', err.error?.message || 'No se pudieron cargar los datos de la oferta');
        setTimeout(() => this.router.navigate(['/empresa/mis-ofertas']), 2500);
      }
    });
  }
/**
   * Convierte un string de fecha (DD/MM/YYYY o YYYY-MM-DD) en un objeto Date de JS
   */
  private parsearFechaEntrada(fechaStr: string | null): Date | null {
    if (!fechaStr) return null;

    // Si viene en formato europeo "15/03/2026"
    if (fechaStr.includes('/')) {
      const partes = fechaStr.split('/');
      // new Date(año, mes-1, día) -> El mes en JS es base 0 (enero = 0)
      return new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    }

    // Si viene en formato ISO o similar
    const d = new Date(fechaStr);
    return isNaN(d.getTime()) ? null : d;
  }
  // Se ejecuta cuando el hijo emite (alGuardar)
  actualizarOferta(datosForm: any) {
    this.cargando = true;
    this.erroresApi = {};

    // Formateamos la fecha antes de enviar a Laravel
    const payload = {
      ...datosForm,
      incorporacion: datosForm.incorporacion ? this.formatDate(datosForm.incorporacion) : null
    };

    // Llamamos a la API de UPDATE (PUT)
    this.ofertasService.actualizarOferta(this.idOferta, payload).subscribe({
      next: (res) => {
        // Laravel nos devuelve un mensaje personalizado si hubo bloqueo parcial
        this.messageService.add({ 
          severity: res.data?.bloqueado ? 'info' : 'success', 
          summary: res.data?.bloqueado ? 'Aviso' : '¡Actualizado!', 
          detail: String(res.message),
          sticky: res.data?.bloqueado // Si está bloqueado, dejamos el mensaje fijo para que lo lean
        });

        // Si no está bloqueada, volvemos al detalle. Si está bloqueada, quizás prefieras dejarles en la página.
        if (!res.data?.bloqueado) {
          setTimeout(() => this.router.navigate(['/empresa/oferta', this.idOferta]), 2000);
        } else {
          this.cargando = false;
        }
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 422 && err.error.errors) {
          this.erroresApi = err.error.errors;
        } else {
          this.showError('Error', err.error?.message || 'Error al actualizar');
        }
      }
    });
  }

  volver() {
    this.router.navigate(['/empresa/oferta', this.idOferta]);
  }

  private showError(titulo: string, detalle: string) {
    this.messageService.add({ severity: 'error', summary: titulo, detail: detalle });
  }

 private formatDate(date: any): string | null {
    if (!date) return null;
    if (typeof date === 'string' && date.includes('-')) return date; 
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}