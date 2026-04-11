import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { PasswordModule } from 'primeng/password'; 
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Header } from '../header/header';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,Header,ToastModule, ConfirmDialogModule,CommonModule,RouterModule,PasswordModule,InputTextModule,ButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers:[ConfirmationService,MessageService]
})
export class Register {
  private confirmationService=inject(ConfirmationService);
private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
private messageService=inject(MessageService);
  roles: any[] = [];
  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role:     [null, [Validators.required]] // ID del rol (2 o 3)
    });
  }

  ngOnInit() {
    // Cargamos los roles desde Laravel al entrar
    this.authService.getRoles().subscribe(res => {
      if (res.success) this.roles = res.data ?? [];
    });
  }

  onSubmit() {
  if (this.registerForm.invalid) return;

 this.authService.registro(this.registerForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.confirmationService.confirm({
            header: '¡Registro completado!',
            message: 'Tu cuenta ha sido creada correctamente...',
            icon: 'pi pi-check-circle',
            acceptLabel: 'Entendido, ir al Login',
            rejectVisible: false, 
            accept: () => {
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error en el registro', 
            detail: String(res.message) || 'No se ha podido crear la cuenta.' 
          });
        }
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error crítico', 
          detail: 'El servidor no responde o el email ya existe.' 
        });
      }
    }); // Cerramos el subscribe correctamente
  }
  

}
