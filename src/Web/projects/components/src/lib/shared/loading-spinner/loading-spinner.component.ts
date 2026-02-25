import { Component, input } from '@angular/core';

@Component({
  selector: 'jf-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center" [class.py-12]="size() === 'lg'" [class.py-4]="size() === 'sm'">
      <div
        class="animate-spin rounded-full border-4 border-jf-coconut border-t-jf-gold"
        [class.h-6]="size() === 'sm'"
        [class.w-6]="size() === 'sm'"
        [class.h-10]="size() === 'md'"
        [class.w-10]="size() === 'md'"
        [class.h-16]="size() === 'lg'"
        [class.w-16]="size() === 'lg'"
      ></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
}
