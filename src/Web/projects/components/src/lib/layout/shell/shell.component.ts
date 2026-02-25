import { Component, input, output, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'jf-shell',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NavComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-jf-black text-jf-coconut">
      <jf-header
        [cartItemCount]="cartItemCount()"
        [isLoggedIn]="isLoggedIn()"
        (cartToggled)="cartToggled.emit()"
        (menuToggled)="menuOpen.set(!menuOpen())"
      />
      <jf-nav
        [isOpen]="menuOpen()"
        [isLoggedIn]="isLoggedIn()"
        (closed)="menuOpen.set(false)"
      />
      <main class="flex-1">
        <ng-content />
      </main>
      <jf-footer />
    </div>
  `,
})
export class ShellComponent {
  cartItemCount = input(0);
  isLoggedIn = input(false);
  cartToggled = output<void>();
  menuOpen = signal(false);
}
