import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jf-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
  `],
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  clicked = output<MouseEvent>();

  buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-body font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants: Record<string, string> = {
      primary: 'bg-jf-gold text-jf-black hover:bg-jf-mango focus:ring-jf-gold disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'border-2 border-jf-gold text-jf-gold hover:bg-jf-gold hover:text-jf-black focus:ring-jf-gold disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'bg-jf-sorrel text-white hover:bg-red-700 focus:ring-jf-sorrel disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}
