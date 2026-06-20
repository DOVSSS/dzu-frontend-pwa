import { TOKEN_KEY } from '../constants/storageKeys';

const USER_KEY = 'dzu_auth_user';

let memoryToken: string | null = null;

export const TokenManager = {
  init(): void {
    try {
      memoryToken = localStorage.getItem(TOKEN_KEY);
    } catch {
      memoryToken = null;
    }
  },

  getToken(): string | null {
    return memoryToken;
  },

  setToken(token: string): void {
    memoryToken = token;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    memoryToken = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser<T>(): T | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};