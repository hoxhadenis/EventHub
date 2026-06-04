import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-8">I Miei Biglietti</h1>
      
      <div *ngIf="isLoading" class="text-center py-10 text-gray-500">
        Caricamento biglietti...
      </div>

      <div *ngIf="!isLoading && tickets.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <h3 class="text-xl font-medium text-gray-900 mb-2">Non hai ancora biglietti</h3>
        <p class="text-gray-500 mb-6">Esplora gli eventi in programma e prenota il tuo posto.</p>
        <a routerLink="/" class="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700">Sfoglia Eventi</a>
      </div>

      <div *ngIf="!isLoading && tickets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div *ngFor="let ticket of tickets" class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row">
          
          <div class="bg-gray-50 p-6 flex flex-col justify-center items-center border-b sm:border-b-0 sm:border-r border-dashed border-gray-300 min-w-[200px]">
            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Ticket ID: #{{ ticket.id }}</p>
            <div class="w-32 h-32 bg-white border-4 border-indigo-100 p-2 rounded-lg shadow-sm">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EventHub_Ticket_{{ticket.id}}" alt="QR Code" class="w-full h-full object-contain">
            </div>
          </div>

          <div class="p-6 flex flex-col justify-center w-full">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ ticket.event.title }}</h3>
            <div class="space-y-1 text-sm text-gray-600 mb-4">
              <p>📅 {{ ticket.event.date | date:'dd MMMM yyyy, HH:mm' }}</p>
              <p>📍 {{ ticket.event.location }}, {{ ticket.event.city }}</p>
            </div>
            
            <div class="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400">
              Acquistato il: {{ ticket.registration_date | date:'dd/MM/yyyy HH:mm' }}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class MyTicketsComponent implements OnInit {
  tickets: any[] = [];
  isLoading = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
