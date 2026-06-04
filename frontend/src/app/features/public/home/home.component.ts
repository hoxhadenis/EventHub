import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { EventService, Event } from '../../../core/services/event.service';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  events$: Observable<Event[]>;
  filterForm: FormGroup;
  
  // Usiamo un BehaviorSubject per innescare la ricerca ogni volta che i filtri cambiano
  private filterSubject = new BehaviorSubject<{city?: string, category?: string}>({});

  constructor(private eventService: EventService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      city: [''],
      category: ['']
    });

    // Quando filterSubject emette un nuovo valore, chiediamo i nuovi eventi al server
    this.events$ = this.filterSubject.pipe(
      switchMap(filters => this.eventService.getEvents(filters))
    );
  }

  ngOnInit(): void {}

  onSearch(): void {
    // Emette i nuovi filtri, aggiornando in automatico la lista grazie a switchMap
    this.filterSubject.next(this.filterForm.value);
  }

  clearFilters(): void {
    this.filterForm.reset({ city: '', category: '' });
    this.filterSubject.next({});
  }
}
