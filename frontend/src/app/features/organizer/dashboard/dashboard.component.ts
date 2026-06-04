import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Organizzatore</h1>
        <a routerLink="/organizer/event/new" class="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
          + Nuovo Evento
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Eventi Attivi</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">3</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Totale Iscritti</h3>
          <p class="mt-2 text-3xl font-bold text-indigo-600">142</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 class="text-sm font-medium text-gray-500 uppercase">Incassi Stimati</h3>
          <p class="mt-2 text-3xl font-bold text-green-600">€ 1.250,00</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">I tuoi eventi recenti</h2>
        </div>
        <div class="p-6 text-center text-gray-500">
          Usa il pulsante "Nuovo Evento" per iniziare a pubblicare sulla piattaforma.
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
