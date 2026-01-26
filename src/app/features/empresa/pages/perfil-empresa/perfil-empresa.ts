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
import { TagModule } from 'primeng/tag'; 
import { ToggleSwitchModule } from 'primeng/toggleswitch'; 
import { Skeleton } from 'primeng/skeleton';



@Component({
  selector: 'app-perfil-empresa',
  standalone: true, // IMPORTANTE: Asegúrate de que esté aquí
  imports: [
   CommonModule, 
    FormsModule, 
    Skeleton,
    InputText, 
    Textarea,
    DrawerModule, 
    InputMask, 
    Drawer, 
  TagModule,
  ToggleSwitchModule,
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
      codigoPostal: '',
      visible: true
    }
  };
visibleDrawer: boolean = false; // Controla el panel de edición
visibleDrawerDireccion: boolean = false;//edicion ubicacion
  loading: boolean = true;
  //empresa vea como lo ven los candidatos

displayEmpresaView: boolean = false;
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

        // Si la dirección existe, "limpiamos" sus tipos
        if (this.perfil.direccion) {
          // El  !!: 1 se convierte en true, 0 se convierte en false
          this.perfil.direccion.visible = !!this.perfil.direccion.visible;
          
        } else {
          // Si no existe, uno limpio
          this.perfil.direccion = { 
            linea1: '', 
            ciudad: '', 
            provincia: '', 
            codigoPostal: '', 
            visible: false 
          };
        }
      }
      
      // Pequeño retardo para que el Skeleton no desaparezca demasiado rapido
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error',detail: err.error?.message || 'No se pudieron recuperar los datos del perfil'});
        this.loading = false;
      }
    });
  }
guardarCambiosPerfil() {
  // 1. Limpiamos los datos para evitar errores 500 y 422
  const { direccion, centro, id, user_id, created_at, updated_at, ...datosEmpresa } = this.perfil;

  this.perfilService.updatePerfil(datosEmpresa).subscribe({
    next: (res: any) => {
      // Lógica del Toast (Éxito o Advertencia)
      let severidad: 'success' | 'warn' = 'success';
      let resumen = 'Perfil Actualizado';

        // Si el mensaje coincide con el del backend para "sin cambios"
      if (res.message === 'No hay cambios que guardar') {
        severidad = 'warn'; // Color amarillo
        resumen = 'Sin cambios';
      }
      this.messageService.add({ 
        severity: severidad, 
        summary: resumen, 
        detail: res.message 
      });

      this.visibleDrawer = false;
    },
    error: (err) => {
      console.error('ERROR DETALLADO DEL SERVIDOR:', err);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error al actualizar', 
        detail: err.error?.message || 'Revisa los datos introducidos' 
      });
    }
  });
}
guardarDireccion() {
  // 1. CREAMOS UN OBJETO LIMPIO: solo lo que el validador de Laravel espera
  const direccionLimpia = {
    linea1: this.perfil.direccion.linea1,
    linea2: this.perfil.direccion.linea2,
    ciudad: this.perfil.direccion.ciudad,
    provincia: this.perfil.direccion.provincia,
    // forzar string me daba problemas esto
    codigoPostal: String(this.perfil.direccion.codigoPostal), 
    // forzar booleno : Para el switch
    visible: !!this.perfil.direccion.visible 
  };

  console.log('DATOS LIMPIOS QUE VIAJAN AL BACKEND:', direccionLimpia);

  this.perfilService.guardarDireccion(direccionLimpia).subscribe({
  next: (res: any) => {
      // Definimos la severidad por defecto como éxito
      let severidad: 'success' | 'warn' = 'success';
      let resumen = 'Ubicación';

      // Si el mensaje coincide con el del backend para "sin cambios"
      if (res.message === 'No hay cambios que guardar.') {
        severidad = 'warn'; // Color amarillo
        resumen = 'Sin cambios';
      }

      this.messageService.add({ 
        severity: severidad, 
        summary: resumen, 
        detail: res.message 
      });
      this.visibleDrawerDireccion = false;
      // Actualizamos los datos locales para que se vea el cambio
      this.perfil.direccion = {
        ...this.perfil.direccion,
        ...direccionLimpia        // Sobrescribimos con los datos que acabamos de guardar
      };
    },
    error: (err) => {
      console.error('ERROR AL GUARDAR:', err);
      // Extraemos el mensaje de error para el Toast
      const detalleError = err.error?.message || 'Error de validación';
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: typeof detalleError === 'string' ? detalleError : 'Revisa el código postal'
      });
    }
  });
}
}