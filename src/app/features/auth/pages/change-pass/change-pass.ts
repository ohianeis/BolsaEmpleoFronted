import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ReseatPass } from '../../../../services/ReseatPass/reseat-pass';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, ButtonModule],
  templateUrl: './change-pass.html',
  styleUrl: './change-pass.css',
  providers: [MessageService]
})
export class ChangePass implements OnInit {
  changeForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bajaService: ReseatPass,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.changeForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar que las contraseñas coinciden
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirmation')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.changeForm.invalid) return;

    this.loading = true;
    this.bajaService.cambiarPasswordPropia(this.changeForm.value).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail:String(res.message) });
        // Redirigir al inicio, el interceptor ya no bloqueará porque change_pass es false
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al actualizar la contraseña';
      }
    });
  }
}