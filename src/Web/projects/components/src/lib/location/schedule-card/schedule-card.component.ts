import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleViewModel } from '../../models';

@Component({
  selector: 'jf-schedule-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-jf-dark rounded-lg p-4 border transition-colors"
      [class.border-jf-gold/30]="schedule().isActive"
      [class.border-jf-gold/5]="!schedule().isActive"
      [class.opacity-60]="!schedule().isActive"
    >
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h4 class="font-display text-lg text-jf-coconut tracking-wide">{{ dayName() }}</h4>
            @if (schedule().isActive) {
              <span class="h-2 w-2 rounded-full bg-jf-lime"></span>
            }
          </div>
          <p class="font-body text-sm text-jf-gold mt-0.5">{{ schedule().location }}</p>
          <p class="font-body text-xs text-gray-400 mt-0.5">{{ schedule().address }}</p>
        </div>

        <div class="text-right">
          <p class="font-body text-sm text-jf-coconut">
            {{ schedule().openTime }} – {{ schedule().closeTime }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ScheduleCardComponent {
  schedule = input.required<ScheduleViewModel>();

  dayName = computed(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.schedule().dayOfWeek] ?? '';
  });
}
