import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { EventService, Event } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  isRegistering = false;
  message = '';
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(+id).subscribe({
        next: (data) => {
          this.event = data;
          this.isLoading = false;
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    }
  }

  register(): void {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.event) {
      this.isRegistering = true;
      this.message = '';
      
      this.eventService.registerToEvent(this.event.id).subscribe({
        next: (res) => {
          this.isRegistering = false;
          this.isError = false;
          this.message = res.msg || 'Iscrizione completata con successo!';
          this.event!.available_seats--; // Aggiorna i posti in tempo reale
        },
        error: (err) => {
          this.isRegistering = false;
          this.isError = true;
          this.message = err.error?.msg || "Errore durante l'iscrizione.";
        }
      });
    }
  }
}
