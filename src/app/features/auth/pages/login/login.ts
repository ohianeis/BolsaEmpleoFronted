
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- IMPORTACIONES DE PRIMENG ---
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../../services/auth';
import { Header } from '../header/header';

@Component({
  selector: 'app-login',
  standalone: true,
 // Agregamos los módulos aquí para que Angular reconozca las etiquetas de PrimeNG
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RouterModule,Header
  ],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Definimos el formulario con validaciones básicas de Angular
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
 ngOnInit(): void {
    console.log('--- 🚀 COMPONENTE LOGIN INICIALIZADO ---');
    
    // 1. Ver qué hay en el servicio (memoria volátil)
    this.authService.verDatos();

    // 2. Ver qué hay en el navegador (memoria persistente)
    console.log('--- 💾 DATOS EN SESSION STORAGE ---');
    console.log('Token:', !!sessionStorage.getItem('token')); // true/false para no ver el churro de texto
    console.log('Rol guardado:', sessionStorage.getItem('rol'));
  }
public prueba(){
  console.log('estoy en login mobile');
}
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe(res => {
 if (res.success && res.data) {
     
      // Le pido al servicio el rol que guardo en memoria
      this.authService.getRolActual().subscribe(rol => {
        this.redirectByRole(rol);
      });
      } else {
        // Aquí capturamos el 'mensaje' de tu captura de pantalla de Laravel
        this.errorMessage = res.message as string;
      }
    });
  }

  private redirectByRole(rol: string | null) {
    if (rol === 'administrador') this.router.navigate(['/admin']);
    else if (rol === 'empresa') this.router.navigate(['/empresa']);
    else if (rol === 'alumno') this.router.navigate(['/alumno']);
    else this.router.navigate(['/login'])
  }
}