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
import { FormsModule } from '@angular/forms'; // Imprescindible para ngModel
import { PerfilService } from '../../../../services/Perfiles/perfilService';
import { TitulosService } from '../../../../services/Titulos/titulos';
import { DrawerModule } from 'primeng/drawer';
import { SkeletonModule } from 'primeng/skeleton';
import { Tag } from 'primeng/tag'; // Importación v18
import { Drawer } from 'primeng/drawer'; // COMPONENTE, no Module
import { TituloAlumno } from '../../../../api/models/Titulos/titulosResponse';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    InputText, 
    Textarea, 
    Select, 
    Button, 
    Toast, 
    Tooltip,
    Dialog, 
    DrawerModule,
    Tag,
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

  //para añadir titulos
  // Variables para el buscador
titulosActivos: any[] = [];
titulosFiltrados: any[] = [];

// Objeto temporal para el nuevo título
nuevoTitulo: any = {
  tituloSeleccionado: null,
  centro: 'Politécnico Estella',
  anio: new Date().getFullYear(),
  cursando: false
  
};
  titulosDisponibles: any[] = [];//para select
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
this.titulosService.getTitulosActivos().subscribe(res => {
    this.titulosActivos = res.data ?? [];
    this.actualizarTitulosDisponibles(); // Intentar filtrar
  });
  // 2. Cargamos los títulos del alumno
  this.titulosService.getMisTitulos().subscribe(res => {
    this.misTitulos = res.data ?? [];
    this.actualizarTitulosDisponibles(); // Re-filtrar con la lista del alumno
  });
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
// 2. Filtrar mientras el usuario escribe titulos activos disponibles
filterTitulos(event: any) {
  const query = event.query.toLowerCase();
  this.titulosFiltrados = this.titulosActivos.filter(t => 
    t.nombre.toLowerCase().includes(query)
  );
}
actualizarTitulosDisponibles() {
  if (!this.misTitulos || !this.titulosActivos) return;

  // Creamos un set con los NOMBRES de los títulos que ya tiene el alumno
  const nombresMisTitulos = this.misTitulos.map(t => t.nombre.toLowerCase()); 
  
  // Filtramos los títulos activos: solo dejamos los que su nombre NO esté en la lista anterior
  this.titulosDisponibles = this.titulosActivos.filter(t => 
    !nombresMisTitulos.includes(t.nombre.toLowerCase())
  );
}
actualizarDatos() {
  const datosAEnviar = {
    nombre: this.perfil.nombre,
    telefono: this.perfil.telefono?.toString(),
    experienciaLaboral: this.perfil.experienciaLaboral,
    situacion: this.perfil.situacione_id // El ID de la tabla situaciones
  };

  this.perfilService.updatePerfil(datosAEnviar).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Perfil Actualizado', detail: `${res.message}` });
      this.visibleDrawer = false;
      this.cargarDatos(); 
    },
    error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' })
  });
}

// 3. Enviar al servidor titulo a añadir
confirmarAddTitulo() {
  if (!this.nuevoTitulo.tituloSeleccionado) return;

  // Creamos el objeto siguiendo EXACTAMENTE la interfaz TituloAlumno
  const nuevoDato: TituloAlumno = {
    id: this.nuevoTitulo.tituloSeleccionado.id,
    nombre: this.nuevoTitulo.tituloSeleccionado.nombre,
    anio: Number(this.nuevoTitulo.anio), // Forzamos a que sea número por si acaso
    centro: this.nuevoTitulo.centro || 'No especificado',
    cursando: !!this.nuevoTitulo.cursando // Forzamos a booleano
  };

  // Metemos el objeto en un array (porque el servicio espera TituloAlumno[])
  const payload: TituloAlumno[] = [nuevoDato];

  this.titulosService.agregarTitulosADemandante(payload).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Título añadido' });
      this.displayDialog = false;
      this.cargarDatos();
      // Reset
      this.nuevoTitulo = { tituloSeleccionado: null, centro: '', anio: new Date().getFullYear(), cursando: false };
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
    }
  });
}
actualizarDireccion() {
  if (this.direccionForm.invalid) {
    this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Cubre todos los campos obligatorios' });
    return;
  }

  // Preparamos el payload según tu validación de Laravel
  const datosDireccion = {
    linea1: this.direccionForm.value.linea1,
    linea2: this.direccionForm.value.linea2,
    ciudad: this.direccionForm.value.ciudad,
    provincia: this.direccionForm.value.provincia,
    codigoPostal: this.direccionForm.value.codigoPostal?.toString(), // Laravel lo pide string
    visible: this.direccionForm.value.visible ? 1 : 0
  };

  this.perfilService.guardarDireccion(datosDireccion).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Dirección', detail: `${res.message}` });
      this.visibleDrawerDireccion = false; // Cerramos este drawer
      this.cargarDatos(); // Refrescamos la vista principal
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
    }
  });
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
