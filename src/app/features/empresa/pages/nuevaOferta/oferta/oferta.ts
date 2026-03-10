import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, timer } from 'rxjs';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { FormOferta } from '../form-oferta/form-oferta';
import { Familia } from '../../../../../api/models/Admin/adminModel';
import { Titulo, TitulosService } from '../../../../../services/Titulos/titulos';
import { OfertasService } from '../../../../../services/Ofertas/ofertas';

// Servicios e Interfaces

// El nuevo componente hijo

@Component({
  selector: 'app-oferta',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule, 
    ToastModule, 
    SkeletonModule, 
    FormOferta // Importante incluirlo aquí
  ],
  templateUrl: './oferta.html'
})
export class Oferta implements OnInit {
  familias: Familia[] = [];
  listaTitulos: Titulo[] = [];
  
  cargando: boolean = false;      // Para el botón de guardar
  cargandoDatos: boolean = true;  // Para el Skeleton inicial
  erroresApi: { [key: string]: string[] } = {};

  constructor(
    private ofertasService: OfertasService,
    private titulosService: TitulosService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carga inicial de datos para los selectores
    forkJoin({
      resFamilias: this.titulosService.getFamilias(),
      resTitulos: this.titulosService.getTitulosActivos(),
      espera: timer(800) // Para que el skeleton no parpadee
    }).subscribe({
      next: (res) => {
        this.familias = res.resFamilias.data || [];
        
        // Formateamos los nombres de los títulos
        const datosTitulos = res.resTitulos.data || [];
        this.listaTitulos = datosTitulos.map(t => ({
          ...t,
          nombre: t.nombre.charAt(0).toUpperCase() + t.nombre.slice(1).toLowerCase()
        })).sort((a, b) => a.nombre.localeCompare(b.nombre));

        this.cargandoDatos = false;
      },
      error: (err) => {
        this.cargandoDatos = false;
        this.showError('Error', 'No se pudieron cargar los selectores');
      }
    });
  }

  // Recibe los datos del hijo (formValue) y los envía a Laravel
  enviarOferta(datosForm: any) {
    this.cargando = true;
    this.erroresApi = {};

    // Formatear datos antes de enviar
    const payload = {
      ...datosForm,
      incorporacion: datosForm.incorporacion ? this.formatDate(datosForm.incorporacion) : null
    };

    this.ofertasService.crearOferta(payload).subscribe({
      next: (res) => {
        this.messageService.add({ 
          severity: 'success', summary: '¡Éxito!', detail: String(res.message) 
        });
        setTimeout(() => this.router.navigate(['/empresa/mis-ofertas']), 1500);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 422 && err.error.errors) {
          this.erroresApi = err.error.errors;
        } else {
          this.showError('Error', err.error?.message || 'Error al guardar');
        }
      }
    });
  }

  volver() {
    this.router.navigate(['/empresa/mis-ofertas']);
  }

  private showError(titulo: string, detalle: string) {
    this.messageService.add({ severity: 'error', summary: titulo, detail: detalle });
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  }
}