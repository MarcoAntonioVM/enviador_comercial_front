import { authService } from '@/features/auth/auth.service';
import { paths } from '@/routes/paths';

type AuthorizedInit = RequestInit & { _retry?: boolean };

let refreshInFlight: Promise<boolean> | null = null;

function getAccessToken(): string | null {
  return localStorage.getItem('token') ?? localStorage.getItem('accessToken');
}

/** Limpia sesión y fuerza login (recarga completa para que los layouts lean storage de nuevo). */
export function clearSessionAndRedirectToLogin(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.assign(paths.LOGIN);
}

async function refreshWithSingleFlight(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = authService
      .refreshSession()
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/**
 * `fetch` con Bearer desde localStorage. Ante 401 intenta una vez renovar sesión con refreshToken;
 * si falla, limpia storage y redirige a login. Si tras renovar sigue 401, devuelve esa respuesta (sin bucle).
 */
export async function authorizedFetch(input: RequestInfo | URL, init?: AuthorizedInit): Promise<Response> {
  const { _retry, ...rest } = init ?? {};
  const headers = new Headers(rest.headers ?? undefined);
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(input, { ...rest, headers });

  if (response.status !== 401 || _retry) {
    return response;
  }

  const ok = await refreshWithSingleFlight();
  if (!ok) {
    clearSessionAndRedirectToLogin();
    return response;
  }

  return authorizedFetch(input, { ...rest, _retry: true });
}
