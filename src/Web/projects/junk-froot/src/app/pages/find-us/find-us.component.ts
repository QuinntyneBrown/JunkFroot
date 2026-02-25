import { Component, inject, OnInit, signal } from '@angular/core';
import { TruckMapComponent, ScheduleCardComponent, ScheduleViewModel } from '@junkfroot/components';
import { LocationApiService } from '@junkfroot/api';

@Component({
  selector: 'app-find-us',
  standalone: true,
  imports: [TruckMapComponent, ScheduleCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider text-center mb-8">FIND THE TRUCK</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <jf-truck-map
            [latitude]="latitude()"
            [longitude]="longitude()"
            [address]="address()"
            [isOperating]="isOperating()"
            [estimatedClose]="estimatedClose()"
          />
        </div>

        <div>
          <h2 class="font-display text-2xl text-jf-coconut tracking-wide mb-4">WEEKLY SCHEDULE</h2>
          <div class="space-y-3">
            @for (day of schedule(); track day.dayOfWeek) {
              <jf-schedule-card [schedule]="day" />
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FindUsComponent implements OnInit {
  private readonly locationApi = inject(LocationApiService);

  latitude = signal(0);
  longitude = signal(0);
  address = signal('');
  isOperating = signal(false);
  estimatedClose = signal('');
  schedule = signal<ScheduleViewModel[]>([]);

  ngOnInit(): void {
    this.locationApi.getCurrentLocation().subscribe({
      next: (loc) => {
        this.latitude.set(loc.latitude);
        this.longitude.set(loc.longitude);
        this.address.set(loc.address);
        this.isOperating.set(loc.estimatedCloseTime !== null);
        this.estimatedClose.set(loc.estimatedCloseTime ?? '');
      },
    });

    this.locationApi.getSchedule().subscribe({
      next: (schedules) => {
        this.schedule.set(
          schedules.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            location: s.location,
            address: s.address,
            openTime: s.openTime,
            closeTime: s.closeTime,
            isActive: s.isActive,
          }))
        );
      },
    });
  }
}
