import { TOKEN_KEY } from '../constants/storageKeys';

// Токен хранится в памяти для быстрого синхронного доступа,
// а также синхронизируется с localStorage для сохранения между сессиями
let memoryToken: string | null = null;

export const TokenManager = {
  // Вызывать при старте приложения
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
  },
};