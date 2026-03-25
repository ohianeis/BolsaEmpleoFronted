import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { PasswordModule } from 'primeng/password'; 
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { Header } from '../header/header';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,Header, ConfirmDialogModule,CommonModule,RouterModule,PasswordModule,InputTextModule,ButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers:[ConfirmationService]
})
export class Register {
  private confirmationService=inject(ConfirmationService);
private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

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

  this.authService.registro(this.registerForm.value).subscribe(res => {
    if (res.success) {
      this.confirmationService.confirm({
        header: '¡Registro completado!',
        message: 'Tu cuenta ha sido creada correctamente. Ahora el CIP Burlada debe revisarla y activarla. Te avisaremos por email.',
        icon: 'pi pi-check-circle',
        acceptLabel: 'Entendido, ir al Login',
        rejectVisible: false, 
        accept: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
  
      alert(res.message || 'Error en el registro');

    }
  }); 
}
}
