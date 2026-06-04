import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-form.component.html'
})
export class EventFormComponent {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private eventService: EventService, private router: Router) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      city: ['', Validators.required],
      available_seats: [50, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      price: [0, Validators.min(0)]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid || !this.selectedFile) {
      this.eventForm.markAllAsTouched();
      if (!this.selectedFile) this.errorMessage = "L'immagine di copertina è obbligatoria.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    Object.keys(this.eventForm.value).forEach(key => {
      formData.append(key, this.eventForm.value[key]);
    });
    
    // Aggiungiamo il file fisico al form data
    formData.append('poster', this.selectedFile);

    this.eventService.createEvent(formData).subscribe({
      next: () => {
        this.router.navigate(['/organizer/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.msg || "Errore durante la creazione dell'evento.";
      }
    });
  }
}
