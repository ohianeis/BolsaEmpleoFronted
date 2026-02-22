import { TitulosService, Titulo } from './../../../../services/Titulos/titulos'; //obtener titulos activos
import { OfertasService } from './../../../../services/Ofertas/ofertas';
import { Familia } from '../../../../api/models/Admin/adminModel'; 
import { Component, OnInit } from '@angular/core';
import { forkJoin,timer } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker'; 
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RegistrarOfertaRequest } from '../../../../api/models/Ofertas/ofertasResponse';
import { MultiSelectModule } from 'primeng/multiselect'; //para select de titulos activos
import { ApiResponse } from '../../../../api/models/apiResponse';
@Component({
  selector: 'app-nueva-oferta',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
    DatePickerModule,
    ToggleSwitchModule,
    SkeletonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    MultiSelectModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './nueva-oferta.html'
})
export class NuevaOferta implements OnInit {
  listaTitulos: Titulo[] = [];
  titulosFiltrados: Titulo[] = [];//lista por familias
  familias: Familia[] = [];//lista de familias
  formOferta: FormGroup;
  cargando: boolean = false;
  cargandoDatos: boolean = true; // controla skeleton

  tiposContrato = [
    { label: 'Indefinido', value: 'Indefinido' },
    { label: 'Temporal', value: 'Temporal' },
    { label: 'Prácticas', value: 'Prácticas' }
  ];
// Añade esta variable para guardar los mensajes de error de la API
erroresApi: { [key: string]: string[] } = {};
  constructor(
    private fb: FormBuilder,
    private ofertasService: OfertasService,
    private titulosService: TitulosService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formOferta = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      observacion: ['', Validators.required],
      tipoContrato: ['Indefinido', Validators.required],
      horario: ['8:00 - 16:00', Validators.required],
      nPuestos: [1, [Validators.required, Validators.min(1)]],
      familia_id: [null],
      titulo: [[]],
      incorporacion: [null], 
  esAnonima: [false]
    });
  }

 ngOnInit(): void {
  this.cargandoDatos = true; // Empieza el Skeleton

  forkJoin({
    resFamilias: this.cargarFamilias(),
    resTitulos: this.cargarTitulos(),
    esperaMinima: timer(800)
  }).subscribe({
    next: (res) => {
      // 1. Asignamos familias
      this.familias = res.resFamilias.data || [];

      // 2. Procesamos y asignamos títulos
      const datosTitulos = res.resTitulos.data || [];
      this.listaTitulos = datosTitulos.map(t => ({
        ...t,
        nombre: t.nombre.charAt(0).toUpperCase() + t.nombre.slice(1).toLowerCase()
      })).sort((a, b) => a.nombre.localeCompare(b.nombre));

      // 3. quitar skeleton
      this.cargandoDatos = false; 
    },
    error: (err) => {
      this.cargandoDatos = false;
      this.showError('Error', err.error?.message || 'No se han cargado los datos correctamente');
    }
  });
}
cargarFamilias() {
  // Ahora devuelve el Observable
  return this.titulosService.getFamilias();
}

cargarTitulos() {
  // Ahora devuelve el Observable
  return this.titulosService.getTitulosActivos();
}
  onFamiliaChange(familiaId: number) {
   const tituloControl = this.formOferta.get('titulo');
  this.erroresApi['familia_id'] = [];

  if (familiaId) {
    // 1. Filtramos los títulos
this.titulosFiltrados = this.listaTitulos
  .filter(t => t.familia_id === familiaId)
  .map(t => ({
    ...t,
    labelPersonalizado: `${t.nombre} (${t.nivel.nivel})` 
  }))  
.sort((a, b) => (b.nivele_id ?? 0) - (a.nivele_id ?? 0));
  // 2. Habilitamos el control desde el TS
    tituloControl?.enable(); 
  } else {
    this.titulosFiltrados = [];
    // 3. Deshabilitamos el control desde el TS
    tituloControl?.disable();
  }
  
  // Limpiamos selección previa
  this.formOferta.patchValue({ titulo: [] });
}
 enviarOferta() {
if (this.formOferta.invalid) {
    this.formOferta.markAllAsTouched();
    return;
  }

  this.cargando = true;
  this.erroresApi = {};

  // 1. Extraemos los valores del formulario
  const formValues = this.formOferta.value;

  // 2. Preparamos el objeto para enviar (Payload)
  // Mapeamos los campos para que coincidan EXACTAMENTE con lo que espera Laravel
  const datos: any = {
    ...formValues,
    // Formateamos la fecha si existe, si no mandamos null
    incorporacion: formValues.incorporacion ? this.formatDate(formValues.incorporacion) : null,
    familia_id: formValues.familia_id,
      titulo: formValues.titulo,
   
    esAnonima: formValues.esAnonima 
  };
console.log('Payload final enviado a la API:', datos);
  this.ofertasService.crearOferta(datos).subscribe({
    next: (res) => {
      this.messageService.add({ 
        severity: 'success', 
        summary: '¡Éxito!', 
        detail: res.message as string 
      });

      setTimeout(() => this.router.navigate(['/empresa/mis-ofertas']), 1500);
    },
    error: (err) => {
      this.cargando = false;
      if (Array.isArray(err.error) && err.error.length > 0) {
        this.erroresApi = err.error[0]; 
        this.showError('Validación', 'Revisa los campos del formulario');
      } 
      else if (err.status === 422 && err.error.errors) {
        this.erroresApi = err.error.errors;
      } 
      else {
        this.showError('Error', err.error.message || 'Error al guardar');
      }
    }
  });
}
// Función para saber si un campo tiene error (local o de API)
getFieldError(field: string): string | null {
  const control = this.formOferta.get(field);
  
  // 1. Prioridad: Errores de la API (Laravel)
  if (this.erroresApi && this.erroresApi[field] && this.erroresApi[field].length > 0) {
    return this.erroresApi[field][0];
  }
  
  // 2. Errores locales (Validators.required, etc.)
  if (control && control.touched && control.errors) {
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}`;
  }
  
  return null;
}
  // Función de ayuda para mostrar los errores
  showError(titulo: string, detalle: string) {
    this.messageService.add({
      severity: 'error',
      summary: titulo,
      detail: detalle
    });
  }
  private formatDate(date: any): string | null {
  if (!date) return null;
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  
  return `${year}-${month}-${day}`;
}
}