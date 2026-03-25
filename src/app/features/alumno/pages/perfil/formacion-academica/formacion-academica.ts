import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos tus interfaces

// PrimeNG
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Familia } from '../../../../../api/models/Admin/adminModel';
import { AñadirTitulo, TituloAlumno } from '../../../../../api/models/Titulos/titulosResponse';
import { Titulo } from '../../../../../services/Titulos/titulos';

@Component({
  selector: 'app-formacion-academica',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, Tag, Dialog, Select, InputText],
  templateUrl: './formacion-academica.html'
})
export class FormacionAcademica {
  // Datos que vienen del Padre
  @Input() misTitulos: TituloAlumno[] = [];
  @Input() familias: Familia[] = [];
  @Input() titulosDisponibles: Titulo[] = []; // Títulos activos que el alumno NO tiene aún

  // Eventos hacia el Padre
  @Output() onEliminar = new EventEmitter<number>();
  @Output() onGuardar = new EventEmitter<{ datos: AñadirTitulo, nombre: string }>();

  // Estado interno del componente
  displayDialog: boolean = false;
  familiaSeleccionada: number | null = null;
  titulosFiltrados: any[] = []; // Se filtran por familia_id (ajustar según tu API)

  nuevoTitulo = {
    tituloSeleccionado: null as any,
    centro: 'Politécnico Estella',
    anio: new Date().getFullYear(),
    cursando: false
  };

  onFamiliaChange(familiaId: number) {
    this.familiaSeleccionada = familiaId;
    this.nuevoTitulo.tituloSeleccionado = null;
    
    // Filtramos los títulos disponibles que pertenecen a esta familia
    // Nota: Asegúrate que el modelo Titulo traiga 'familia_id'
    this.titulosFiltrados = this.titulosDisponibles.filter((t: any) => t.familia_id === familiaId);
  }

  confirmarAdd() {
    if (!this.nuevoTitulo.tituloSeleccionado) return;

    const payload: AñadirTitulo = {
      id: this.nuevoTitulo.tituloSeleccionado.id,
      anio: Number(this.nuevoTitulo.anio),
      centro: this.nuevoTitulo.centro,
      cursando: !!this.nuevoTitulo.cursando
    };

    // Emitimos los datos y el nombre para que el padre actualice la lista local
    this.onGuardar.emit({ 
      datos: payload, 
      nombre: this.nuevoTitulo.tituloSeleccionado.nombre 
    });

    this.displayDialog = false;
    this.resetForm();
  }

  private resetForm() {
    this.familiaSeleccionada = null;
    this.titulosFiltrados = [];
    this.nuevoTitulo = {
      tituloSeleccionado: null,
      centro: 'Politécnico Estella',
      anio: new Date().getFullYear(),
      cursando: false
    };
  }
}