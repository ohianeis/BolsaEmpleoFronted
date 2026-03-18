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
import { SkeletonModule } from 'primeng/skeleton';
import { Tag } from 'primeng/tag'; // Importación v18
import { Drawer } from 'primeng/drawer'; // COMPONENTE, no Module
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload'; // Añade a imports
import { AñadirTitulo, TituloAlumno } from '../../../../api/models/Titulos/titulosResponse';
import { BotonBajaComponent } from '../../../Shared/components/boton-baja/boton-baja';
import { CvGestion } from '../../../../services/CV/cv-gestion';
import { Cv } from '../../../../api/models/CV/CvResponse';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
    InputText, 
    Textarea, 
    Select, 
    Button, 
    Toast, 
    Dialog, 
    Drawer,
    Tag,
    BotonBajaComponent,
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
  private cvService = inject(CvGestion);
  familias: any[] = [];
  familiaSeleccionada: number | null = null;

 

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
//variable para cv
miCv: Cv | null = null;
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
    this.cargarFamilias();
    this.cargarCv();
  }
cargarFamilias() {
    this.titulosService.getFamilias().subscribe(res => {
      this.familias = res.data ?? [];
    });
  }
onFamiliaChange(familiaId: number) {
  this.familiaSeleccionada = familiaId;
  this.nuevoTitulo.tituloSeleccionado = null; 

  // IMPORTANTE: Filtramos sobre titulosDisponibles (los que NO tiene el alumno)
  this.titulosFiltrados = this.titulosDisponibles.filter(t => 
    t.familia_id === familiaId
  );
}
  cargarDatos() {
    this.loading = true;
    
    // Usamos forkJoin o suscripciones encadenadas para asegurar que tenemos todo antes de filtrar
    this.titulosService.getTitulosActivos().subscribe(resActivos => {
      this.titulosActivos = resActivos.data ?? [];
      
      this.titulosService.getMisTitulos().subscribe(resMisTitulos => {
        this.misTitulos = resMisTitulos.data ?? [];
        
        // Una vez tenemos ambos, calculamos los disponibles
        this.actualizarTitulosDisponibles();
        
        // Si ya había una familia seleccionada (ej. tras un error de guardado), refrescamos el filtro
        if (this.familiaSeleccionada) {
          this.onFamiliaChange(this.familiaSeleccionada);
        }
      });
    });

    this.perfilService.getPerfil<any>().subscribe({
      next: (res) => {
        if (res.data) {
          this.perfil = res.data;
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

this.perfilService.getSituaciones().subscribe({
  next: (res: any) => {
    // Si res es un array lo asigna, si viene en .data también lo pilla, sino pone array vacío
    this.situaciones = Array.isArray(res) ? res : (res.data ?? []);
    console.log('Situaciones cargadas correctamente:', this.situaciones);
  },
  error: (err) => {
  console.error('Error al obtener las situaciones:', err);
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error de sistema', 
      detail: err.error.message,
    });
  }
});  }
actualizarTitulosDisponibles() {
  if (!this.misTitulos || !this.titulosActivos) return;
  
  // MAPEO: Extraemos el titulo_id real de la lista del alumno
  // Usamos Number() para asegurar que la comparación no falle por tipos (string vs number)
  const idsQueYaTengo = this.misTitulos.map(t => Number(t.titulo_id)); 
  
  // FILTRO: Solo dejamos los títulos activos cuyo ID NO esté en los que ya tiene el alumno
  this.titulosDisponibles = this.titulosActivos.filter(t => 
    !idsQueYaTengo.includes(Number(t.id))
  );

  // Refrescamos la lista visual del selector según la familia elegida
  if (this.familiaSeleccionada) {
    this.titulosFiltrados = this.titulosDisponibles.filter(t => 
      t.familia_id === this.familiaSeleccionada
    );
  }
}

confirmarAddTitulo() {
  if (!this.nuevoTitulo.tituloSeleccionado) return;

  const tituloSeleccionado = this.nuevoTitulo.tituloSeleccionado;

  const datosParaServer: AñadirTitulo = {
    id: tituloSeleccionado.id,
    centro: this.nuevoTitulo.centro || 'No especificado',
    anio: Number(this.nuevoTitulo.anio),
    cursando: !!this.nuevoTitulo.cursando
  };

  this.titulosService.agregarTitulosADemandante([datosParaServer]).subscribe({
    next: (res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Título añadido' });

      // 1. CREAMOS EL OBJETO LOCALMENTE
      // Usamos el ID que nos devuelve el servidor para que se pueda borrar luego
      const nuevoTituloLista: TituloAlumno = {
        id: res.data?.id || 0, // El ID de la tabla pivote que viene de Laravel
        titulo_id: tituloSeleccionado.id,
        nombre: tituloSeleccionado.nombre,
        anio: datosParaServer.anio,
        centro: datosParaServer.centro,
        cursando: datosParaServer.cursando,
        activado: 1
      };

      // 2. ACTUALIZAMOS EL ESTADO LOCAL (Sin recargar de la API)
      this.misTitulos.push(nuevoTituloLista);
      this.actualizarTitulosDisponibles(); // Esto lo quita del selector

      this.displayDialog = false;
      this.resetNuevoTitulo();
      
      // YA NO LLAMAMOS A this.cargarDatos(); <-- Adiós al refresh
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message });
    }
  });
}
resetNuevoTitulo() {
  this.familiaSeleccionada = null;
  this.titulosFiltrados = [];
  this.nuevoTitulo = { 
    tituloSeleccionado: null, 
    centro: 'Politécnico Estella', 
    anio: new Date().getFullYear(), 
    cursando: false 
  };
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

// 2. Filtrar mientras el usuario escribe titulos activos disponibles
filterTitulos(event: any) {
  const query = event.query.toLowerCase();
  this.titulosFiltrados = this.titulosActivos.filter(t => 
    t.nombre.toLowerCase().includes(query)
  );
}

actualizarDatos() {
  const datosAEnviar = {
    nombre: this.perfil.nombre,
    telefono: this.perfil.telefono?.toString(),
    experienciaLaboral: this.perfil.experienciaLaboral,
    situacion: this.perfil.situacione_id
  };

  this.perfilService.updatePerfil(datosAEnviar).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Perfil Actualizado', detail: String(res.message) });
      
      // OPTIMIZACIÓN: Buscamos el nombre de la situación nueva para que el Tag se actualice
      const situacionNueva = this.situaciones.find(s => s.id === this.perfil.situacione_id);
      if (situacionNueva && this.perfil.situacion) {
        this.perfil.situacion.situacion = situacionNueva.situacion;
      }

      this.visibleDrawer = false;
      // Ya no llamamos a this.cargarDatos();
    },
    error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' })
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
  this.titulosService.eliminarTituloDemandante(idPivot).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: String(res.message) });
      
      // Quitamos de la lista local comparando contra el ID del pivote
      this.misTitulos = this.misTitulos.filter(t => t.id !== idPivot);
      
      // LLAMADA CLAVE: Esto hará que el título vuelva a estar disponible en el selector
      this.actualizarTitulosDisponibles();
    }
  });
}

//curriculum
cargarCv() {
  this.cvService.getMiCv().subscribe({
    next: (res) => {
      // res.data ya trae la propiedad full_url gracias al map del servicio
      this.miCv = res.data || null;
    },
    error: () => this.miCv = null
  });
}

onSubirCv(event: FileUploadHandlerEvent) {
  const file = event.files[0];
  if (!file) return;

  this.cvService.subirCv(file).subscribe({
    next: (res) => {
      this.miCv = res.data || null; // Ya viene con full_url
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Currículum actualizado' });
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo subir el archivo' });
    }
  });
}
  borrarCv() {
    this.cvService.eliminarCv().subscribe({
      next: () => {
        this.miCv = null;
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Currículum borrado' });
      }
    });
  }
 

}
