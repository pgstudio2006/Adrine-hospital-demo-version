import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, hasAccess, ModuleKey } from '@/types/roles';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name: string, options?: { department?: string }) => void;
  logout: () => void;
  canAccess: (module: ModuleKey) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('adrine_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((role: UserRole, name: string, options?: { department?: string }) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      role,
      department: options?.department,
    };
    setUser(newUser);
    localStorage.setItem('adrine_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('adrine_user');
  }, []);

  const canAccess = useCallback((module: ModuleKey) => {
    if (!user) return false;
    return hasAccess(user.role, module);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
