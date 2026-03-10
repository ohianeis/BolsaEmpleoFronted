import { Select } from 'primeng/select';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/api';

// PrimeNG
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Familia,TituloAdmin,TituloRequest } from '../../../../../api/models/Admin/adminModel';
import { Nivel } from '../../../../../services/Titulos/titulos';
import { AdminService } from '../../../../../services/Admin/AdminService';
import { CierreOferta } from '../../../../../services/MotivosCierreOferta/cierre-oferta';
import { DetalleMotivo, Motivo } from '../../../../../api/models/MotivoCierreOferta/motivoCierreResponse';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule,SelectButton, TableModule, ButtonModule, DialogModule, InputTextModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './config.html',
  styleUrl: './config.css'
})
export class Config implements OnInit {

    // Referencia a la tabla para poder filtrarla por código
  @ViewChild('dt') dt: Table | undefined;//tabla titulo
  @ViewChild('dtFamilias') dtFamilias: Table | undefined;//tabla famlia
  // Opciones para el filtro de estado
  stateOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Activos', value: 'activo' },   // El valor debe coincidir con lo que devuelve tu backend ('activo')
    { label: 'Inactivos', value: 'inactivo' }
  ];
  filtroEstado: string = 'todos';//filtro para titulos activos/ainactivos
  filtroEstadoFamilia: string = 'todos';//filtro para tabla familias activos/inactivos
  titulos: TituloAdmin[] = [];
  niveles: Nivel[] = [];
  familias: Familia[] = [];
  cargando: boolean = true;
  //control familias
  displayFamiliaDialog: boolean = false;
tituloFamiliaDialog: string = '';
nuevaFamilia = { id: 0, nombre: '' };

  // Control del Diálogo titulo
  displayDialog: boolean = false;
  tituloDialog: string = '';
  
  // Modelo para el formulario
  nuevoTitulo = {
    id: 0,
    nombre: '',
    nivel: null as number | null,
    familia: null as number | null,
    centro: 1 // Aquí podrías pillar el ID del centro del admin logueado
  };
//tabla motivos bajas
@ViewChild('dtMotivos') dtMotivos: Table | undefined;
@ViewChild('dtDetalles') dtDetalles: Table | undefined;

motivos: Motivo[] = [];
detalles: DetalleMotivo[] = [];
motivoSeleccionadoParaDetalle: number | null = null;
filtroEstadoMotivo: string = 'todos';
private detalleMotivosService=inject(CierreOferta);
// Control Diálogos Motivos
displayMotivoDialog: boolean = false;
tituloMotivoDialog: string = '';
nuevoMotivo = { id: 0, nombre: '' };

// Control Diálogos Detalles
displayDetalleDialog: boolean = false;
tituloDetalleDialog: string = '';
nuevoDetalle = { id: 0, nombre: '', motivo_id: 2 };
  constructor(private adminService: AdminService, private messageService: MessageService) {}

  ngOnInit() {
    this.cargarDatos();
    this.cargarNiveles();
    this.cargarFamilias();
    this.cargarMotivos();
  }

  cargarDatos() {
    this.cargando = true;
    this.adminService.getTitulos().subscribe({
      next: (res) => { this.titulos = res.data ?? [];
         this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cargarNiveles() {
    this.adminService.getNiveles().subscribe({
      next: (res) => this.niveles = res.data ?? []
    });
  }

  abrirNuevo() {
this.nuevoTitulo = { id: 0, nombre: '', nivel: null, familia: null, centro: 1 };
    this.tituloDialog = 'Añadir Nueva Titulación';
    this.displayDialog = true;
  }

  editar(t: TituloAdmin) {
    // Buscamos el ID del nivel comparando el nombre que viene en la tabla con la lista de niveles
    const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
    const familiaEncontrada = this.familias.find(f => f.nombre === t.familia); // <--- NUEVO
  this.nuevoTitulo = {
      id: t.id,
      nombre: t.titulo,
      nivel: nivelEncontrado ? nivelEncontrado.id : null,
      familia: familiaEncontrada ? familiaEncontrada.id : null, // <--- NUEVO
      centro: 1
    };
    this.tituloDialog = 'Editar Titulación';
    this.displayDialog = true;
  }

  guardar() {
    if (!this.nuevoTitulo.nombre || !this.nuevoTitulo.nivel || !this.nuevoTitulo.familia) {
        this.messageService.add({severity:'warn', summary:'Incompleto', detail:'Por favor, rellena todos los campos'});
        return;
    }

    const request: TituloRequest = {
      nombre: this.nuevoTitulo.nombre,
      nivel: this.nuevoTitulo.nivel,
      familia: this.nuevoTitulo.familia, // <--- NUEVO
      centro: this.nuevoTitulo.centro
    };

if (this.nuevoTitulo.id > 0) {
        this.adminService.actualizarTitulo(this.nuevoTitulo.id, request).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: String(res.message) });
                this.cerrarYRefrescar();
            },
            error: (err) => {
                console.error('Error completo recibido:', err);

    const mensajeError = err.error?.message || 'Error al actualizar la familia';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Atención',
                    detail: mensajeError
                
                });
            }
        });
    } else {
      this.adminService.crearTitulo(request).subscribe({
        next: (res) => {
          this.messageService.add({severity:'success', summary:'Creado', detail:String(res.message)});
          this.cerrarYRefrescar();
        }
      });
    }
  }

  borrar(id: number) {
    this.adminService.eliminarTitulo(id).subscribe({
      next: (res) => {
        this.messageService.add({severity:'info', summary:'Resultado',detail: String(res.message)});
        this.cargarDatos();
      }
    });
  }
//controlar famlias
cargarFamilias() { 
    this.adminService.getFamilias().subscribe({
      next: (res) => this.familias = res.data ?? []
    });
  }
  abrirModalFamilia() {
  this.nuevaFamilia = { id: 0, nombre: '' };
  this.tituloFamiliaDialog = 'Nueva Familia Profesional';
  this.displayFamiliaDialog = true;
}

editarFamilia(f: any) {
  this.nuevaFamilia = { ...f };
  this.tituloFamiliaDialog = 'Editar Familia';
  this.displayFamiliaDialog = true;
}

guardarFamilia() {
  if (!this.nuevaFamilia.nombre) return;

  const request = { nombre: this.nuevaFamilia.nombre };

if (this.nuevaFamilia.id > 0) {
    this.adminService.actualizarFamilia(this.nuevaFamilia.id, request).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary:'Éxito', detail: String(res.message) || 'Familia actualizada'});
        this.displayFamiliaDialog = false;
        this.cargarFamilias();
      },
      error: (err) => {
        // Aquí capturamos el 403 definido en Laravel
        const mensajeError = err.error?.message || 'Error al actualizar la familia';
        this.messageService.add({
          severity: 'error', 
          summary: 'Atención', 
          detail: mensajeError,
          sticky: true // Para que el admin lo lea bien
        });
      }
    });
  } else {
    this.adminService.crearFamilia(request).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Familia creada'});
        this.displayFamiliaDialog = false;
        this.cargarFamilias();
      }
    });
  }
}

borrarFamilia(id: number) {
  this.adminService.eliminarFamilia(id).subscribe({
    next: (res) => {
      this.messageService.add({severity:'info', summary:'Eliminado', detail: String(res.message) || 'familia desactivada'});
      this.cargarFamilias();
      this.cargarDatos();
      
    }
  });
}
reactivarFamilia(id: number) {
  this.adminService.actualizarFamilia(id, { activa: true }).subscribe({
    next: (res) => {
      this.messageService.add({severity:'success', summary:'Reactivada', detail: String(res.message) || 'Familia reactivada'});
      this.cargarFamilias();
      this.cargarDatos();
    }
  });
}


  cerrarYRefrescar() {
    this.displayDialog = false;
    this.cargarDatos();
  }
  // No olvides añadir el método reactivar a tu clase
reactivar(t: TituloAdmin) {
  const nivelEncontrado = this.niveles.find(n => n.nivel === t.nivel);
  const familiaEncontrada = this.familias.find(f => f.nombre === t.familia); // <--- BUSQUEDA DE FAMILIA
  const request = {
    nombre: t.titulo,
    nivel: nivelEncontrado ? nivelEncontrado.id : 0,
    familia: familiaEncontrada ? familiaEncontrada.id : 0,
    centro: 1, 
    activado: 1 // Forzamos la reactivación
  };

this.adminService.actualizarTitulo(t.id, request).subscribe({
    next: (res) => {
      this.messageService.add({
        severity: 'success', 
        summary: 'Reactivado', 
        detail: 'El título vuelve a estar disponible para nuevas ofertas'
      });
      this.cargarDatos();
    },
    // --- ESTO ES LO QUE TE FALTA ---
    error: (err) => {
      console.error('Error al reactivar:', err);
      
      // Capturamos el mensaje que vimos en tu consola: err.error.message
      const mensajeDinamico = err.error?.message || err.error?.errors || 'No se pudo reactivar el título';

      this.messageService.add({
        severity: 'error', 
        summary: 'No se puede reactivar', 
        detail: mensajeDinamico,
        sticky: true // Para que el admin lo lea bien y no desaparezca rápido
      });
    }
  });
}
  filtradoTitulos(event: any) {
    const val = event.value;
    if (val === 'todos') {
      this.dt?.filter('', 'estado', 'equals'); // Limpia el filtro
    } else {
      this.dt?.filter(val, 'estado', 'equals'); // Filtra por 'activo' o 'inactivo'
    }
  }
  //filtra familias por activas e inactivas
  filtradoFamilia(event: any) {
  const val = event.value;
  if (val === 'todos') {
    this.dtFamilias?.filter('', 'activa', 'equals'); // Limpia el filtro
  } else {
    // Como en familias usamos boolean (true/false), filtramos por el valor booleano
    const boolVal = (val === 'activo'); 
    this.dtFamilias?.filter(boolVal, 'activa', 'equals');
  }
}
// --- MÉTODOS PARA GESTIÓN DE MOTIVOS DE CIERRE ---
cargarMotivos() {
  this.detalleMotivosService.getConfiguracionAdmin().subscribe({
    next: (res) => {
      this.motivos = res.data ?? [];
      
      // Buscamos específicamente el motivo 2 que viene de tu nuevo controlador
      const motivoNoAsignacion = this.motivos.find(m => m.id === 2);
      
      if (motivoNoAsignacion) {
        this.motivoSeleccionadoParaDetalle = motivoNoAsignacion.id;
        // Cargamos los detalles directamente
        this.detalles = motivoNoAsignacion.detalles ? [...motivoNoAsignacion.detalles] : [];
      } else {
        this.detalles = [];
        this.motivoSeleccionadoParaDetalle = null;
      }
    },
    error: (err) => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo conectar con la API'});
    }
  });
}
filtradoMotivos(event: any) {
  const val = event.value;
  if (val === 'todos') {
    this.dtDetalles?.filter('', 'activo', 'equals');
  } else {
    // Como 'activo' es booleano en tu modelo DetalleMotivo
    const boolVal = (val === 'activo'); 
    this.dtDetalles?.filter(boolVal, 'activo', 'equals');
  }
}


abrirModalDetalle() {
  this.nuevoDetalle = { 
    id: 0, 
    nombre: '', 
    motivo_id: 2 // Forzamos siempre el 2 ya que es el único que gestionamos
  };
  this.tituloDetalleDialog = 'Nueva Razón de Cierre';
  this.displayDetalleDialog = true;
}

editarDetalle(d: DetalleMotivo) {
  this.nuevoDetalle = { 
    id: d.id, 
    nombre: d.nombre, 
    motivo_id: d.motivo_id 
  };
  this.tituloDetalleDialog = 'Editar Razón';
  this.displayDetalleDialog = true;
}

guardarDetalle() {
  if (!this.nuevoDetalle.nombre || !this.nuevoDetalle.motivo_id) return;

  const datos: Partial<DetalleMotivo> = {
    nombre: this.nuevoDetalle.nombre,
    motivo_id: this.nuevoDetalle.motivo_id
  };

  if (this.nuevoDetalle.id > 0) {
    this.detalleMotivosService.actualizarDetalle(this.nuevoDetalle.id, datos).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Razón actualizada' });
        this.displayDetalleDialog = false;
        this.cargarMotivos(); // Recargamos el árbol completo
      }
    });
  } else {
    this.detalleMotivosService.crearDetalle(datos).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Razón creada' });
        this.displayDetalleDialog = false;
        this.cargarMotivos();
      }
    });
  }
}

// Método para activar/desactivar (Borrado lógico)
toggleEstadoDetalle(detalle: DetalleMotivo) {
  const nuevoEstado = !detalle.activo;
  this.detalleMotivosService.actualizarDetalle(detalle.id, { activo: nuevoEstado }).subscribe({
    next: () => {
      this.messageService.add({
        severity: nuevoEstado ? 'success' : 'info',
        summary: nuevoEstado ? 'Reactivado' : 'Desactivado',
        detail: `La razón ahora está ${nuevoEstado ? 'visible' : 'oculta'} para las empresas`
      });
      this.cargarMotivos();
    }
  });
}
}