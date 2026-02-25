import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'jf-badge',
  standalone: true,
  template: `
    <span [class]="badgeClasses()">{{ label() }}</span>
  `,
  styles: [`
    :host { display: inline-block; }
  `],
})
export class BadgeComponent {
  label = input.required<string>();
  variant = input<'vegan' | 'gf' | 'nf' | 'df' | 'default'>('default');

  badgeClasses = computed(() => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium';

    const variants: Record<string, string> = {
      vegan: 'bg-jf-lime/20 text-jf-lime',
      gf: 'bg-jf-mango/20 text-jf-mango',
      nf: 'bg-jf-sorrel/20 text-jf-sorrel',
      df: 'bg-jf-gold/20 text-jf-gold',
      default: 'bg-jf-coconut text-jf-dark',
    };

    return `${base} ${variants[this.variant()]}`;
  });
}
