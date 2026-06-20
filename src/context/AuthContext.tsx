import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User } from '../types/api.types';
import { TokenManager } from '../services/tokenManager';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    TokenManager.init();
    const token = TokenManager.getToken();
    const savedUser = TokenManager.getUser<User>();

    if (token && savedUser) {
      setUserState(savedUser);
    } else if (token && !savedUser) {
      // Токен есть, но юзера нет — невалидная сессия, чистим
      TokenManager.clearToken();
    }

    setIsLoading(false);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      TokenManager.setUser(newUser);
    }
  };

  const logout = () => {
    TokenManager.clearToken();
    setUserState(null);
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