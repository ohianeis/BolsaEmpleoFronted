import { PerfilResponse } from './../../../../api/models/Perfil/perfilResponse';
import { PerfilService } from './../../../../services/Perfiles/perfilService';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Imprescindible para ngModel
// Nuevos componentes de Pestañas en v18
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs'; 
// Otros componentes v18
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea'; 
import { InputMask } from 'primeng/inputmask';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { Drawer } from 'primeng/drawer';



@Component({
  selector: 'app-perfil-empresa',
  standalone: true, // IMPORTANTE: Asegúrate de que esté aquí
  imports: [
   CommonModule, 
    FormsModule, 
   
    InputText, 
    Textarea,
    DrawerModule, 
    InputMask, 
    Drawer, 
  
    Button, 
    Toast
  ],
  providers: [MessageService],
  templateUrl: './perfil-empresa.html',
  styleUrl: './perfil-empresa.css',
})
export class PerfilEmpresa implements OnInit { 
  
  // Usamos 'any' o una inicialización parcial para evitar errores de tipado estrictos
  perfil: any = {
    nombre: '',
    cif: '',
    localidad: '',
    direccion: {
      linea1: '',
      ciudad: '',
      provincia: '',
      codigoPostal: 0,
      visible: true
    }
  };
visibleDrawer: boolean = false; // Controla el panel de edición
visibleDrawerDireccion: boolean = false;//edicion ubicacion
  loading: boolean = true;

  constructor(
    private perfilService: PerfilService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerDatosPerfil();
  }

  obtenerDatosPerfil() {
    this.perfilService.getPerfil().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.perfil = res.data;
          if (!this.perfil.direccion) {
            this.perfil.direccion = { 
              linea1: '', ciudad: '', provincia: '', codigoPostal: '', visible: true 
            };
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar con el servidor' });
        this.loading = false;
      }
    });
  }

  guardarCambiosPerfil() {
    // Extraemos direccion y centro para enviar solo datos de empresa
    const { direccion, centro, ...datosEmpresa } = this.perfil;
    
    this.perfilService.updatePerfil(datosEmpresa).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res.message as string });
        }
      }
    });
  }

  guardarDireccion() {
    this.perfilService.guardarDireccion(this.perfil.direccion).subscribe({
      next: (res) => {
        if (res.success) {
          this.messageService.add({ severity: 'success', summary: 'Ubicación', detail: res.message as string });
        }
      }
    });
  }
}