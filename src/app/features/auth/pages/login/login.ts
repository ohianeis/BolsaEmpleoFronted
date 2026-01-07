
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../../services/auth'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- IMPORTACIONES DE PRIMENG ---
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

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
    MessageModule
  ],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    // Definimos el formulario con validaciones básicas de Angular
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe(res => {
      if (res.success) {
        // Redirigir según el rol que guardamos en sessionStorage
        const rol = sessionStorage.getItem('rol');
        this.redirectByRole(rol);
      } else {
        // Aquí capturamos el 'mensaje' de tu captura de pantalla de Laravel
        this.errorMessage = res.message as string;
      }
    });
  }

  private redirectByRole(rol: string | null) {
    if (rol === '1') this.router.navigate(['/admin']);
    else if (rol === '2') this.router.navigate(['/empresa']);
    else this.router.navigate(['/alumno']);
  }
}