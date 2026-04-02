import { createContext, useContext, useState } from 'react';
import { parseJwt } from '../utils/Auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
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
  const login = (token) => {
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

export const useAuth = () => useContext(AuthContext);
