'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface SessionContextType {
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession | null) => void;
  availableUsers: UserSession[];
  refreshUsers: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserSession[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      // 1. Fetch current active session from cookie
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user) {
          setCurrentUser(meData.user);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }

      // 2. Fetch available users list if needed
      const res = await fetch('/api/auth');
      if (res.ok) {
        const data: UserSession[] = await res.json();
        setAvailableUsers(data);
      }
    } catch (err) {
      console.error('Failed to load session users', err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = async (userId: string) => {
    const target = availableUsers.find((u) => u.id === userId);
    if (!target) return;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target.email, password: '123' }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        refreshUsers: fetchUsers,
        switchUser,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
