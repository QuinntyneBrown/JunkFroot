import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../config/api.config';
import {
  CateringRequest,
  EventBooking,
  OperatingSchedule,
  TruckLocation,
  TruckLocationUpdate,
} from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationApiService {
<<<<<<< HEAD
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);
  private hubConnection: signalR.HubConnection | null = null;
=======
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
>>>>>>> 30a9abd24d741c9d3e6e37f237b78bc0bc8d6ab7

  getCurrentLocation(): Observable<TruckLocation> {
    return this.http.get<TruckLocation>(`${this.baseUrl}/api/location/truck/current`);
  }

  updateTruckLocation(update: TruckLocationUpdate): Observable<TruckLocation> {
    return this.http.post<TruckLocation>(
      `${this.baseUrl}/api/location/truck/update`,
      update
    );
  }

  getSchedule(): Observable<OperatingSchedule[]> {
    return this.http.get<OperatingSchedule[]>(`${this.baseUrl}/api/location/schedule`);
  }

  getTodaySchedule(): Observable<OperatingSchedule> {
    return this.http.get<OperatingSchedule>(`${this.baseUrl}/api/location/schedule/today`);
  }

  getEvents(): Observable<EventBooking[]> {
    return this.http.get<EventBooking[]>(`${this.baseUrl}/api/location/events`);
  }

  createEvent(event: Partial<EventBooking>): Observable<EventBooking> {
    return this.http.post<EventBooking>(`${this.baseUrl}/api/location/events`, event);
  }

  submitCateringRequest(request: CateringRequest): Observable<CateringRequest> {
    return this.http.post<CateringRequest>(
      `${this.baseUrl}/api/location/catering/request`,
      request
    );
  }

  connectToLocationHub(): Observable<TruckLocationUpdate> {
    const subject = new Subject<TruckLocationUpdate>();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/truck-location`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('LocationUpdated', (update: TruckLocationUpdate) => {
      subject.next(update);
    });

    this.hubConnection
      .start()
      .catch((err) => subject.error(err));

    return subject.asObservable();
  }

  disconnectFromLocationHub(): void {
    this.hubConnection?.stop();
    this.hubConnection = null;
  }
}
