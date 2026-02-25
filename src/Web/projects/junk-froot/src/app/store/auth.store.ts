import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthApiService, AppUser, AuthTokens } from '@junkfroot/api';

interface AuthState {
  user: AppUser | null;
  token: string | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authApi = inject(AuthApiService);

  private readonly state = signal<AuthState>({
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
    loading: false,
  });

  readonly user = computed(() => this.state().user);
  readonly isLoggedIn = computed(() => !!this.state().token);
  readonly loading = computed(() => this.state().loading);

  login(email: string, password: string): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.authApi.login({ email, password }).subscribe({
      next: (tokens) => this.handleTokens(tokens),
      error: () => {
        this.state.update((s) => ({ ...s, loading: false }));
      },
    });
  }

  register(email: string, password: string, name: string): void {
    this.state.update((s) => ({ ...s, loading: true }));
    this.authApi.register({ email, password, name }).subscribe({
      next: (tokens) => this.handleTokens(tokens),
      error: () => {
        this.state.update((s) => ({ ...s, loading: false }));
      },
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.state.set({ user: null, token: null, loading: false });
  }

  private handleTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.accessToken);
    this.state.update((s) => ({
      ...s,
      token: tokens.accessToken,
      loading: false,
    }));
  }
}
