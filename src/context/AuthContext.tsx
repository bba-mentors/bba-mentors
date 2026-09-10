import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Role } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: (User & { profileId?: string }) | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<void>;
  registerParent: (data: any) => Promise<void>;
  registerMentor: (data: any) => Promise<string>;
  logout: () => void;
  quickDemoLogin: (targetRole: Role) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { profileId?: string }) | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bba_mentors_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = user?.role || null;

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.getCurrentUser();
        const profileId = data.profile?.id;
        setUser({ ...data.user, profileId });
      } catch (err) {
        console.warn('Session restoration failed:', err);
        localStorage.removeItem('bba_mentors_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string, requestedRole?: Role) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password, role: requestedRole });
      localStorage.setItem('bba_mentors_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const registerParent = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.registerParent(data);
      localStorage.setItem('bba_mentors_token', res.token);
      setToken(res.token);
      setUser({ ...res.user, profileId: res.parent.id });
    } finally {
      setIsLoading(false);
    }
  };

  const registerMentor = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.registerMentor(data);
      localStorage.setItem('bba_mentors_token', res.token);
      setToken(res.token);
      setUser({ ...res.user, profileId: res.mentor.id });
      return res.message;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bba_mentors_token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (targetRole: Role) => {
    setIsLoading(true);
    try {
      if (targetRole === 'PARENT') {
        await login('rajesh.sharma@example.com', 'Parent123!', 'PARENT');
      } else if (targetRole === 'MENTOR') {
        await login('amit.kumar@bbamentors.com', 'Mentor123!', 'MENTOR');
      } else if (targetRole === 'ADMIN') {
        await login('admin@bbamentors.com', 'Admin123!', 'ADMIN');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await api.getCurrentUser();
      const profileId = data.profile?.id;
      setUser({ ...data.user, profileId });
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerParent,
        registerMentor,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
