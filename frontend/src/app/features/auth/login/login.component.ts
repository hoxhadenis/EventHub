import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Definizione del form reattivo e delle validazioni
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Al login riuscito, smistiamo l'utente in base al ruolo
        if (response.user.role === 'organizer' || response.user.role === 'admin') {
          this.router.navigate(['/organizer/dashboard']);
        } else {
          this.router.navigate(['/']); // Utente normale va alla home
        }
      },
      error: (err) => {
        this.isLoading = false;
        // Mostriamo il messaggio di errore che arriva dal nostro backend Flask
        this.errorMessage = err.error?.msg || 'Credenziali non valide. Riprova.';
      }
    });
  }
}
