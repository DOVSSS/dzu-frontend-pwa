import { createContext, useContext, useEffect, useState,type ReactNode } from 'react';
import {type User } from '../types/api.types';
import { TokenManager } from '../services/tokenManager';
import { getMeRequest } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Восстанавливаем сессию при старте приложения
    const init = async () => {
      TokenManager.init();
      const token = TokenManager.getToken();
      if (token) {
        try {
          const me = await getMeRequest();
          setUser(me);
        } catch {
          TokenManager.clearToken();
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const logout = () => {
    TokenManager.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};