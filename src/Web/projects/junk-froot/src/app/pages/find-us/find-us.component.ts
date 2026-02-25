import { Component, inject, OnInit } from '@angular/core';
import { TruckMapComponent, ScheduleCardComponent } from '@junkfroot/components';
import { LocationStore } from '../../store/location.store';

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
            [latitude]="locationStore.latitude()"
            [longitude]="locationStore.longitude()"
            [address]="locationStore.address()"
            [isOperating]="locationStore.isOperating()"
            [estimatedClose]="locationStore.estimatedClose()"
          />
        </div>

        <div>
          <h2 class="font-display text-2xl text-jf-coconut tracking-wide mb-4">WEEKLY SCHEDULE</h2>
          <div class="space-y-3">
            @for (day of locationStore.schedule(); track day.dayOfWeek) {
              <jf-schedule-card [schedule]="day" />
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FindUsComponent implements OnInit {
  readonly locationStore = inject(LocationStore);

  ngOnInit(): void {
    this.locationStore.loadCurrentLocation();
    this.locationStore.loadSchedule();
  }
}
