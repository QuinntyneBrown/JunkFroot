import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import {
  CateringRequest,
  EventBooking,
  OperatingSchedule,
  TruckLocation,
} from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getCurrentLocation(): Observable<TruckLocation> {
    return this.http.get<TruckLocation>(`${this.baseUrl}/api/location/truck/current`);
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
}
