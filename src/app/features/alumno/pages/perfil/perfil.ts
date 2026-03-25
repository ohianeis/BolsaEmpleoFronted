import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

// PrimeNG
import { Toast } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

// Servicios
import { PerfilService } from '../../../../services/Perfiles/perfilService';
import { Titulo, TitulosService } from '../../../../services/Titulos/titulos';
import { CvGestion } from '../../../../services/CV/cv-gestion';

// Modelos
import { TituloAlumno, AñadirTitulo } from '../../../../api/models/Titulos/titulosResponse';
import { Cv } from '../../../../api/models/CV/CvResponse';

// Componentes Hijos

import { BotonBajaComponent } from '../../../Shared/components/boton-baja/boton-baja';
import { PerfilDemandante, Situaciones } from '../../../../api/models/Demandantes/demantantesResponse';
import { Familia } from '../../../../api/models/Admin/adminModel';
import { PerfilInfo } from "./perfil-info/perfil-info";
import { DireccionCard } from "./direccion-card/direccion-card";
import { PerfilDialog } from './perfil-dialog/perfil-dialog';
import { GestionCv } from './gestion-cv/gestion-cv';
import { FormacionAcademica } from './formacion-academica/formacion-academica';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, Toast, SkeletonModule, Drawer,
    InputText, Textarea, Select, Button, Tag, BotonBajaComponent,
    PerfilInfo,
    DireccionCard,PerfilDialog,GestionCv,FormacionAcademica
],
  providers: [MessageService],
  templateUrl: './perfil.html'
})
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilService);
  private titulosService = inject(TitulosService);
  private cvService = inject(CvGestion);
  private messageService = inject(MessageService);

  // Estado de Datos
  perfil: PerfilDemandante | null = null;
  misTitulos: TituloAlumno[] = [];
  titulosActivos: Titulo[] = [];
  titulosDisponibles: Titulo[] = [];
  familias: Familia[] = [];
  situaciones: Situaciones[] = [];
miCv: Cv | null | undefined = null;

  // Estado UI
  loading: boolean = true;
  visibleDrawerPerfil: boolean = false;
  visibleDrawerDireccion: boolean = false;
  displayPreview: boolean = false;

  // Formularios
  direccionForm!: FormGroup;

  ngOnInit() {
    this.initFormularios();
    this.cargarTodo();
  }

  initFormularios() {
    this.direccionForm = this.fb.group({
      linea1: ['', Validators.required],
      linea2: [''],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      visible: [1]
    });
  }
onBorrarCv() {
    this.cvService.eliminarCv().subscribe({
      next: (res) => {
        this.miCv = null;
        this.messageService.add({ severity: 'info', summary: 'CV eliminado', detail: String(res.message) ||'Curriculum borrado' });
      }
    });
  }
  actualizarDireccion() {
    if (this.direccionForm.invalid) return;

    const datosDireccion = {
      ...this.direccionForm.value,
      codigoPostal: this.direccionForm.value.codigoPostal?.toString(),
      visible: this.direccionForm.value.visible ? 1 : 0
    };

    this.perfilService.guardarDireccion(datosDireccion).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String( res.message) || 'Dirección actualizada' });
        if (this.perfil) {
           this.perfil.direccion = { ...datosDireccion };
        }
        this.visibleDrawerDireccion = false;
      },
      error: (err) => this.messageService.add({ severity: 'error', detail: err.error?.message })
    });
  }
actualizarPerfil() {
  if (!this.perfil) return;

  const datosAEnviar = {
    nombre: this.perfil.nombre,
    telefono: this.perfil.telefono?.toString(),
    experienciaLaboral: this.perfil.experienciaLaboral,
    situacion: this.perfil.situacione_id
  };

  this.perfilService.updatePerfil(datosAEnviar).subscribe({
    next: (res: any) => {
      // 1. Buscamos el objeto de la situación en el array local (que usa .situacion)
      const encontrada = this.situaciones.find(s => s.id === this.perfil?.situacione_id);

      if (encontrada && this.perfil) {
        // 2. Sincronizamos el objeto anidado 'situacion' del perfil
        // Tu JSON dice: perfil.situacion.situacion
        this.perfil.situacion = {
          ...this.perfil.situacion,
          id: encontrada.id,
          situacion: encontrada.situacion // <--- IMPORTANTE: Usamos .situacion
        };

        // 3. Clonamos el objeto para que el p-tag se entere del cambio
        this.perfil = { ...this.perfil };
      }

      this.messageService.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: res.message || 'Perfil actualizado' 
      });
      
      this.visibleDrawerPerfil = false;
    },
    error: (err) => {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo guardar los cambios' 
      });
    }
  });
}
  cargarTodo() {
    this.loading = true;
    forkJoin({
      perfil: this.perfilService.getPerfil<PerfilDemandante>(),
      situaciones: this.perfilService.getSituaciones(),
      familias: this.titulosService.getFamilias(),
      activos: this.titulosService.getTitulosActivos(),
      misTitulos: this.titulosService.getMisTitulos(),
      cv: this.cvService.getMiCv()
    }).subscribe({
      next: (res: any) => {
        this.perfil = res.perfil.data;
        this.situaciones = Array.isArray(res.situaciones) ? res.situaciones : (res.situaciones.data ?? []);
        this.familias = res.familias.data ?? [];
        this.titulosActivos = res.activos.data ?? [];
        this.misTitulos = res.misTitulos.data ?? [];
        this.miCv = res.cv.data ?? null;

        if (this.perfil?.direccion) {
          this.direccionForm.patchValue(this.perfil.direccion);
        }
        this.actualizarTitulosDisponibles();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  actualizarTitulosDisponibles() {
    const idsQueYaTengo = this.misTitulos.map(t => Number(t.titulo_id));
    this.titulosDisponibles = this.titulosActivos.filter(t => !idsQueYaTengo.includes(Number(t.id)));
  }

  // Lógica Formación
  guardarNuevoTitulo(ev: { datos: AñadirTitulo, nombre: string }) {
    this.titulosService.agregarTitulosADemandante([ev.datos]).subscribe({
      next: (res:any) => {
        const nuevo: TituloAlumno = {
          id: res.data?.id || 0,
          titulo_id: ev.datos.id,
          nombre: ev.nombre,
          anio: ev.datos.anio,
          centro: ev.datos.centro,
          cursando: ev.datos.cursando,
          activado: 1
        };
        this.misTitulos = [...this.misTitulos, nuevo];
        this.actualizarTitulosDisponibles();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String(res.message) || 'Título añadido' });
      }
    });
  }

  borrarTitulo(idPivot: number) {
    this.titulosService.eliminarTituloDemandante(idPivot).subscribe({
      next: (res) => {
        this.misTitulos = this.misTitulos.filter(t => t.id !== idPivot);
        this.actualizarTitulosDisponibles();
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: String(res.message) || 'Título borrado' });
      }
    });
  }

  // Lógica CV
onSubirCv(file: File) {
    this.cvService.subirCv(file).subscribe({
      next: (res) => {
        this.miCv = res.data;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String(res.message) || 'CV Actualizado' });
      },
      error: (err) => this.messageService.add({ severity: 'error', detail: 'Error al subir el archivo' })
    });
  }

}
      