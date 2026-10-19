import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, LoginResponse, Role, UserSession } from '../types/auth';

const TOKEN_KEY = 'polleria_auth_token';
const USER_KEY = 'polleria_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Restore session from localStorage on app boot
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUserStr = localStorage.getItem(USER_KEY);
      if (savedToken && savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr) as UserSession;
        setToken(savedToken);
        setUser(parsedUser);
      }
    } catch (e) {
      console.error('Error recovering session from localStorage', e);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, pin: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsLocked(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pin }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Error al iniciar sesión';

        if (contentType && contentType.includes('application/json')) {
          const problem = await response.json();
          errorMessage = problem.detail || problem.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }

        if (response.status === 423) {
          setIsLocked(true);
        }

        setError(errorMessage);
        return false;
      }

      const data: LoginResponse = await response.json();

      const userSession: UserSession = {
        username: data.username,
        role: data.role,
      };

      setToken(data.token);
      setUser(userSession);
      setError(null);
      setIsLocked(false);

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userSession));

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo conectar con el servidor';
      setError(`Error de conexión: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    setIsLocked(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const clearError = () => {
    setError(null);
    setIsLocked(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user ? user.role : null,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        isLocked,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export const getRoleDefaultPath = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'CAJERO':
      return '/cajero';
    case 'MESERO':
      return '/mozo';
    case 'COCINA':
      return '/cocina';
    default:
      return '/login';
  }
};
