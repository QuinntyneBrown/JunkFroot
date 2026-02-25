import { Injectable, inject, signal, computed } from '@angular/core';
import { LocationApiService, TruckLocation, OperatingSchedule } from '@junkfroot/api';
import type { ScheduleViewModel } from '@junkfroot/components';

interface LocationState {
  currentLocation: TruckLocation | null;
  schedule: OperatingSchedule[];
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocationStore {
  private readonly locationApi = inject(LocationApiService);

  private readonly state = signal<LocationState>({
    currentLocation: null,
    schedule: [],
    loading: false,
  });

  readonly latitude = computed(() => this.state().currentLocation?.latitude ?? 0);
  readonly longitude = computed(() => this.state().currentLocation?.longitude ?? 0);
  readonly address = computed(() => this.state().currentLocation?.address ?? '');
  readonly isOperating = computed(() => this.state().currentLocation?.estimatedCloseTime !== null);
  readonly estimatedClose = computed(() => this.state().currentLocation?.estimatedCloseTime ?? '');
  readonly loading = computed(() => this.state().loading);

  readonly schedule = computed<ScheduleViewModel[]>(() =>
    this.state().schedule.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      location: s.location,
      address: s.address,
      openTime: s.openTime,
      closeTime: s.closeTime,
      isActive: s.isActive,
    }))
  );

  loadCurrentLocation(): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.locationApi.getCurrentLocation().subscribe({
      next: (loc) => {
        this.state.update((s) => ({ ...s, currentLocation: loc, loading: false }));
      },
      error: () => {
        this.state.update((s) => ({ ...s, loading: false }));
      },
    });
  }

  loadSchedule(): void {
    this.locationApi.getSchedule().subscribe({
      next: (schedule) => {
        this.state.update((s) => ({ ...s, schedule }));
      },
    });
  }
}
