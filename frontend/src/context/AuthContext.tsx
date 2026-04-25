import { createContext, useContext, useState } from 'react';
import { parseJwt } from '../utils/Auth';
import type { User } from '../types/definitions';

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = parseJwt(token);
      if (payload.exp * 1000 > Date.now()) {
        return { username: payload.sub, roles: payload.roles ?? [], id: payload.userID };
      }
      localStorage.removeItem('token');
      return null;
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const payload = parseJwt(token);
    setUser({ username: payload.sub, roles: payload.roles ?? [], id: payload.userID });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
