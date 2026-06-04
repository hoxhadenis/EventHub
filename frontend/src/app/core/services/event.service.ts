import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  city: string;
  available_seats: number;
  category: string;
  price: number;
  poster_path: string;
  organizer_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  getEvents(filters?: { city?: string; category?: string }): Observable<Event[]> {
    let params = new HttpParams();
    if (filters?.city) params = params.set('city', filters.city);
    if (filters?.category) params = params.set('category', filters.category);
    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // Nuova funzione: usa FormData perché dobbiamo inviare un file (l'immagine)
  getMyTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-tickets`);
  }

  registerToEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/register`, {});
  }

  createEvent(eventData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, eventData);
  }
}
