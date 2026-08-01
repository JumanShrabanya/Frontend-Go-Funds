'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authSession, isTokenExpired, isTokenExpiringSoon, getTokenExpiration } from '../../auth/auth-session';
import api, { refreshAccessToken } from '../../api/axios.instance';
import { CircularProgress, Box } from '@mui/material';

import { UserProfile } from '../../types/auth.types';

const publicPaths = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/forgot-password', '/auth/reset-otp', '/auth/reset-password', '/'];

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  logout: () => Promise<void>;
  updateUserSession: (updatedUser: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const updateUserSession = useCallback((updatedUser: UserProfile) => {
    authSession.saveUser(updatedUser);
    setUser(updatedUser);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = authSession.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', undefined, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
      }
    } catch {
      // Ignore network errors to ensure UI logout completes
    } finally {
      authSession.clear();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/auth/login');
    }
  }, [router]);

  // Initial Auth Check
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const accessToken = authSession.getAccessToken();
      const refreshToken = authSession.getRefreshToken();

      if (accessToken && !isTokenExpiringSoon(accessToken, 60)) {
        if (isMounted) {
          setIsAuthenticated(true);
          setUser(authSession.getUser());
          setIsLoading(false);
          document.cookie = "hasSession=true; path=/; max-age=604800; SameSite=Lax";
        }
        return;
      }

      // Access token is missing, expired, or expiring within 60s -> perform silent refresh
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken && isMounted) {
          setIsAuthenticated(true);
          setUser(authSession.getUser());
          setIsLoading(false);
          document.cookie = "hasSession=true; path=/; max-age=604800; SameSite=Lax";
          return;
        }
      }

      if (isMounted) {
        authSession.clear();
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Proactive Background Auto-Refresh Timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const accessToken = authSession.getAccessToken();
    if (!accessToken) return;

    const exp = getTokenExpiration(accessToken);
    if (!exp) return;

    const now = Math.floor(Date.now() / 1000);
    // Refresh 60 seconds before expiration, or immediately if < 60s remain
    const secondsUntilRefresh = Math.max(exp - now - 60, 5);

    const timerId = setTimeout(async () => {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        setUser(authSession.getUser());
      } else {
        setIsAuthenticated(false);
        setUser(null);
        authSession.clear();
        router.push('/auth/login');
      }
    }, secondsUntilRefresh * 1000);

    return () => clearTimeout(timerId);
  }, [isAuthenticated, user, router]);

  // Route Protection & Navigation Guard
  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = publicPaths.includes(pathname);

    if (isAuthenticated && isPublicPath && pathname !== '/') {
      // Logged-in user shouldn't visit login/register/otp
      router.replace('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      // Guest shouldn't visit private dashboard routes
      router.replace('/auth/login');
    }
  }, [isAuthenticated, pathname, isLoading, router]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
        <CircularProgress size={40} sx={{ color: '#2563EB' }} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, updateUserSession }}>
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
