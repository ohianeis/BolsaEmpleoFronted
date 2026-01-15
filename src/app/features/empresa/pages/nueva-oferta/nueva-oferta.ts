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
  if (this.formOferta.invalid) return;

  this.cargando = true;
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
      
      // En Laravel, si hay error de validación (422), 
      // suele venir en err.error.errors o err.error.message
      const errorData = err.error;
      
      if (err.status === 422 && errorData.errors) {
        // Ejemplo: sacamos el primer mensaje de error de validación
        const firstKey = Object.keys(errorData.errors)[0];
        const msg = errorData.errors[firstKey][0];
        this.showError('Validación', msg);
      } else {
        this.showError('Error', errorData.message || 'Error al guardar');
      }
    }
  });
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