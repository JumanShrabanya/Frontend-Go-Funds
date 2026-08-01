import type { AuthTokens, UserProfile } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'currentUser';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  const payload = parseJwtPayload(token);
  return payload && typeof payload.exp === 'number' ? payload.exp : null;
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
}

export function isTokenExpiringSoon(token: string, thresholdSeconds: number = 60): boolean {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= thresholdSeconds;
}

export const authSession = {
  getAccessToken(): string | null {
    return isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  },

  getRefreshToken(): string | null {
    return isBrowser() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  },

  getUser(): UserProfile | null {
    if (!isBrowser()) return null;

    const value = localStorage.getItem(USER_KEY);
    if (!value) return null;

    try {
      return JSON.parse(value) as UserProfile;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  save(tokens: AuthTokens): void {
    if (!isBrowser()) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    if (tokens.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
    }
    // Set cookie for middleware server-side redirection (7 days max-age)
    document.cookie = "hasSession=true; path=/; max-age=604800; SameSite=Lax";
  },

  saveUser(user: UserProfile): void {
    if (!isBrowser()) return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear(): void {
    if (!isBrowser()) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Remove cookie for middleware server-side redirection
    document.cookie = "hasSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
};
