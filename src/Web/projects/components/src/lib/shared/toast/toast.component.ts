import { Component, input, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jf-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="toastClasses()"
      role="alert"
    >
      <div class="flex items-center gap-3">
        <span class="text-lg">{{ icon() }}</span>
        <p class="font-body text-sm">{{ message() }}</p>
      </div>
      <button
        class="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
        (click)="dismissed.emit()"
        aria-label="Dismiss"
      >
        &#x2715;
      </button>
    </div>
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  message = input.required<string>();
  type = input<'success' | 'error' | 'info' | 'warning'>('info');
  duration = input(4000);
  dismissed = output<void>();

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  icon(): string {
    const icons: Record<string, string> = {
      success: '\u2713',
      error: '\u2717',
      info: '\u2139',
      warning: '\u26A0',
    };
    return icons[this.type()];
  }

  toastClasses(): string {
    const base = 'flex items-center justify-between px-4 py-3 rounded-lg shadow-lg min-w-[300px]';

    const variants: Record<string, string> = {
      success: 'bg-jf-lime/90 text-white',
      error: 'bg-jf-sorrel/90 text-white',
      info: 'bg-jf-dark text-jf-coconut',
      warning: 'bg-jf-mango/90 text-jf-black',
    };

    return `${base} ${variants[this.type()]}`;
  }

  ngOnInit(): void {
    if (this.duration() > 0) {
      this.timeoutId = setTimeout(() => this.dismissed.emit(), this.duration());
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
