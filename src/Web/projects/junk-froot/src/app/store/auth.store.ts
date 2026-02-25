import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthApiService, AuthResponse } from '@junkfroot/api';
import { setAccessToken, getAccessToken, clearAccessToken } from '@junkfroot/api';
import type { AppUser } from '@junkfroot/api';

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
    token: getAccessToken(),
    loading: false,
  });

  readonly user = computed(() => this.state().user);
  readonly isLoggedIn = computed(() => !!this.state().token);
  readonly loading = computed(() => this.state().loading);

  login(email: string, password: string): Observable<AuthResponse> {
    this.state.update((s) => ({ ...s, loading: true }));
    return this.authApi.login({ email, password }).pipe(
      tap({
        next: (response) => this.handleAuthResponse(response),
        error: () => {
          this.state.update((s) => ({ ...s, loading: false }));
        },
      })
    );
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    this.state.update((s) => ({ ...s, loading: true }));
    return this.authApi.register({ email, password, name }).pipe(
      tap({
        next: (response) => this.handleAuthResponse(response),
        error: () => {
          this.state.update((s) => ({ ...s, loading: false }));
        },
      })
    );
  }

  logout(): void {
    clearAccessToken();
    this.state.set({ user: null, token: null, loading: false });
  }

  private handleAuthResponse(response: AuthResponse): void {
    setAccessToken(response.accessToken);
    this.state.update((s) => ({
      ...s,
      user: response.user,
      token: response.accessToken,
      loading: false,
    }));
  }
}
