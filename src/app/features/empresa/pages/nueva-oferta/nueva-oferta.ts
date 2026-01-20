import { TitulosService, Titulo } from './../../../../services/Titulos/titulos'; //obtener titulos activos
import { OfertasService } from './../../../../services/Ofertas/ofertas';
import { Component, OnInit } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { RegistrarOfertaRequest } from '../../../../api/models/Ofertas/ofertasResponse';
import { MultiSelectModule } from 'primeng/multiselect'; //para select de titulos activos
@Component({
  selector: 'app-nueva-oferta',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule,
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
  formOferta: FormGroup;
  cargando: boolean = false;

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
      titulo: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarTitulos();
  }

 cargarTitulos() {
  this.titulosService.getTitulosActivos().subscribe({
    next: (res: Titulo[]) => {
      // 1. Transformamos: Primera Mayúscula, resto minúscula
      // 2. Ordenamos: Alfabéticamente por nombre
      this.listaTitulos = res
        .map(t => ({
          ...t,
          nombre: t.nombre.charAt(0).toUpperCase() + t.nombre.slice(1).toLowerCase()
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

      console.log('Títulos procesados:', this.listaTitulos);
    },
    error: (err) => this.showError('Error', 'No se pudieron cargar los títulos')
  });
}
 enviarOferta() {
if (this.formOferta.invalid) {
    this.formOferta.markAllAsTouched(); // Marcamos todo para mostrar validaciones locales
    return;
  }

  this.cargando = true;
  this.erroresApi = {}; // Limpiamos errores previos al intentar enviar
  const datos: RegistrarOfertaRequest = this.formOferta.value;

  this.ofertasService.crearOferta(datos).subscribe({
    next: (res) => {
      // Usamos res.message de tu interfaz ApiResponse
      this.messageService.add({ 
        severity: 'success', 
        summary: '¡Éxito!', 
        detail: res.message as string // Casteamos a string por si tu interfaz dice string|boolean
      });

      setTimeout(() => this.router.navigate(['/empresa/mis-ofertas']), 1500);
    },
error: (err) => {
  this.cargando = false;
  
  // Si la API devuelve el array [{ "nombre": [...] }]
  if (Array.isArray(err.error) && err.error.length > 0) {
    // Extraemos el primer objeto del array y lo asignamos a erroresApi
    this.erroresApi = err.error[0]; 
    this.showError('Validación', 'Revisa los campos del formulario');
  } 
  // Por si acaso en otros casos viene el formato estándar de Laravel
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
}