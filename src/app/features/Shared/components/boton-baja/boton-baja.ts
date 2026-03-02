import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { BajaUsuario } from '../../../../services/Baja/baja-usuario';
import { MessageService } from 'primeng/api';
// PrimeNG
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-boton-baja',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, Dialog, Select, Textarea],
  templateUrl: './boton-baja.html' // Volvemos a usar tu HTML original
})
export class BotonBajaComponent {
  // Inyectamos los servicios
  private bajaService = inject(BajaUsuario);
  private messageService = inject(MessageService);
  private router = inject(Router);

  displayBajaDialog: boolean = false;
  motivosBaja: any[] = [];
  bajaPayload = { motivo_baja_id: null as number | null, comentario: '' };

  abrirDialogo() {
    this.bajaService.getMotivos().subscribe({
      next: (res) => {
        this.motivosBaja = res.data ?? [];
        this.displayBajaDialog = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los motivos' });
      }
    });
  }

  confirmarBaja() {
    if (!this.bajaPayload.motivo_baja_id) return;

    const payload = {
      motivo_baja_id: this.bajaPayload.motivo_baja_id as number,
      comentario: this.bajaPayload.comentario
    };

    this.bajaService.ejecutarBajaPropia(payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: String(res.message) });
        this.displayBajaDialog = false;
        
        // El truco del almendruco: Salida limpia
        setTimeout(() => {
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Atención', 
          detail: err.error.message || 'No se pudo procesar la baja' 
        });
      }
    });
  }
}