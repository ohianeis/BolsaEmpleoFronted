import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker'; 
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { Familia } from '../../../../../api/models/Admin/adminModel';
import { Titulo } from '../../../../../services/Titulos/titulos';

// Interfaces (Asegúrate de que las rutas sean correctas)

@Component({
  selector: 'app-form-oferta',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    InputTextModule, TextareaModule, InputNumberModule,
    ButtonModule, SelectModule, DatePickerModule,
    ToggleSwitchModule, MultiSelectModule
  ],
  templateUrl: './form-oferta.html'
})
export class FormOferta implements OnInit {
  // Datos que vienen del padre (Nueva u Editar)
  @Input() datosIniciales: any = null;
  @Input() estaBloqueada: boolean = false;
  @Input() cargando: boolean = false;
  @Input() familias: Familia[] = [];
  @Input() listaTitulos: Titulo[] = [];
  @Input() erroresApi: { [key: string]: string[] } = {};

  // Salidas hacia el padre
  @Output() alGuardar = new EventEmitter<any>();
  @Output() alCancelar = new EventEmitter<void>();

  formOferta: FormGroup;
  titulosFiltrados: any[] = [];
  
  tiposContrato = [
    { label: 'Indefinido', value: 'Indefinido' },
    { label: 'Temporal', value: 'Temporal' },
    { label: 'Prácticas', value: 'Prácticas' }
  ];

  constructor(private fb: FormBuilder) {
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

  ngOnInit() {
    if (this.datosIniciales) {
      // Si estamos editando, parcheamos el formulario
      this.formOferta.patchValue(this.datosIniciales);
      
      // Si hay una familia seleccionada, cargamos sus títulos
      if (this.datosIniciales.familia_id) {
        this.onFamiliaChange(this.datosIniciales.familia_id);
        // Volvemos a parchear los títulos porque onFamiliaChange los resetea
        this.formOferta.get('titulo')?.setValue(this.datosIniciales.titulo || []);
      }
    }
  }
ngOnChanges(changes: SimpleChanges) {
    // Si el padre nos dice que está bloqueada, aplicamos el estado al form
    if (changes['estaBloqueada']) {
      this.gestionarBloqueo();
    }
  }
  private gestionarBloqueo() {
    const controlesCriticos = ['nombre', 'tipoContrato', 'familia_id', 'titulo'];
    
    controlesCriticos.forEach(key => {
      const control = this.formOferta.get(key);
      if (this.estaBloqueada) {
        control?.disable({ emitEvent: false }); // Deshabilitar sin disparar eventos
      } else {
        // Solo habilitamos si no es el de títulos (que depende de familia)
        if (key !== 'titulo') control?.enable({ emitEvent: false });
      }
    });
  }
  onFamiliaChange(familiaId: number) {
    const tituloControl = this.formOferta.get('titulo');
    
    if (familiaId) {
      this.titulosFiltrados = this.listaTitulos
        .filter(t => t.familia_id === familiaId)
        .map(t => ({
          ...t,
          labelPersonalizado: `${t.nombre} (${t.nivel?.nivel || 'N/A'})` 
        }))
        .sort((a, b) => (b.nivele_id ?? 0) - (a.nivele_id ?? 0));
      
      tituloControl?.enable();
    } else {
      this.titulosFiltrados = [];
      tituloControl?.disable();
    }
    
    // Solo reseteamos si el usuario cambia la familia manualmente (no en el patchValue inicial)
    if (this.formOferta.dirty) {
        tituloControl?.setValue([]);
    }
  }

  getFieldError(field: string): string | null {
    const control = this.formOferta.get(field);
    if (this.erroresApi && this.erroresApi[field]?.length > 0) {
      return this.erroresApi[field][0];
    }
    if (control && control.touched && control.errors) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}`;
    }
    return null;
  }

  submit() {
    if (this.formOferta.valid) {
      // Enviamos el valor crudo (incluye campos deshabilitados si los hubiera)
      this.alGuardar.emit(this.formOferta.getRawValue());
    } else {
      this.formOferta.markAllAsTouched();
    }
  }
}