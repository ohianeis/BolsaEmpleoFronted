import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// Imports de PrimeNG
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select'; 
import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { AutoComplete } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms'; // Imprescindible para ngModel
import { FloatLabel } from 'primeng/floatlabel'; // Opcional, pero queda genial
import { PerfilService } from '../../../../services/Perfiles/perfilService';
import { TitulosService } from '../../../../services/Titulos/titulos';
import { DrawerModule } from 'primeng/drawer';
import { SkeletonModule } from 'primeng/skeleton';
import { Tag } from 'primeng/tag'; // Importación v18
import { Drawer } from 'primeng/drawer'; // COMPONENTE, no Module
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule, 
    Card, 
    InputText, 
    Textarea, 
    Select, 
    Button, 
    Toast, 
    Dialog, 
    AutoComplete,
    DrawerModule,
    Tag,
    FloatLabel,
    Drawer,
    SkeletonModule
  ],providers: [MessageService],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private fb = inject(FormBuilder);
  private perfilService = inject(PerfilService);
  private titulosService = inject(TitulosService);
  private messageService = inject(MessageService);
  perfil: any = null;
loading: boolean = true;
visibleDrawer: boolean = false;
visibleDrawerDireccion: boolean = false;
displayPreview: boolean = false;
displayDialog: boolean = false; // Para el p-dialog de añadir título
  perfilForm!: FormGroup;
  direccionForm!: FormGroup;
  situaciones: any[] = [];
  misTitulos: any[] = [];

  ngOnInit() {
    this.initFormularios();
    this.cargarDatos();
  }

  initFormularios() {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      telefono: [''],
      experienciaLaboral: [''],
      situacion: [null]
    });

    this.direccionForm = this.fb.group({
      linea1: ['', Validators.required],
      linea2: [''],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      visible: [true]
    });
  }
cargarDatos() {
    this.loading = true;
    this.perfilService.getPerfil<any>().subscribe({
      next: (res) => {
        if (res.data) {
          this.perfil = res.data; // <--- Sincronizamos los datos con la variable del ngModel
          
          // Parcheamos los formularios para mantener la lógica reactiva si la usas
          this.perfilForm.patchValue({
            nombre: this.perfil.nombre,
            telefono: this.perfil.telefono,
            experienciaLaboral: this.perfil.experienciaLaboral,
            situacion: this.perfil.situacione_id
          });
          
          if (this.perfil.direccion) this.direccionForm.patchValue(this.perfil.direccion);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Cargar Situaciones
    this.perfilService.getSituaciones().subscribe(res => this.situaciones = res);

    // Cargar Títulos del alumno
this.titulosService.getMisTitulos().subscribe(res => {
  // Si res.data existe, lo asigna. Si es undefined, asigna []
  this.misTitulos = res.data ?? []; 
});  }

actualizarDatos() {
  // Enviamos los datos que el usuario ha editado en el Drawer vía ngModel
  const datosAEnviar = {
    nombre: this.perfil.nombre,
    telefono: this.perfil.telefono,
    experienciaLaboral: this.perfil.experienciaLaboral,
    situacion: this.perfil.situacione_id
  };

  this.perfilService.updatePerfil(datosAEnviar).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Perfil', detail: `${res.message}` });
      this.visibleDrawer = false;
      this.cargarDatos(); // Refrescamos para ver los cambios aplicados
    },
    error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' })
  });
}

  actualizarDireccion() {
    this.perfilService.guardarDireccion(this.direccionForm.value).subscribe({
      next: (res) => this.messageService.add({ severity: 'success', summary: 'Dirección', detail: `${res.message}`})    });
  }
  eliminarTitulo(idPivot: number) {
  // Usamos el servicio de títulos
  this.titulosService.eliminarTituloDemandante(idPivot).subscribe({
    next: (res) => {
      // Mostramos mensaje de éxito
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Eliminado', 
        detail: `${res.message}` 
      });
      // Recargamos la lista para que desaparezca visualmente
      this.cargarDatos(); 
    },
    error: (err) => {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: err.error.message
      });
    }
  });
}

}
