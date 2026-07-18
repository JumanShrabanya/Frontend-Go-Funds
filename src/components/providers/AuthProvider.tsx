'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authSession } from '../../auth/auth-session';
import api from '../../api/axios.instance';
import { CircularProgress, Box } from '@mui/material';

const publicPaths = ['/auth/login', '/auth/register', '/auth/verify-otp', '/'];

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(window.atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = async () => {
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
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = authSession.getAccessToken();
      const refreshToken = authSession.getRefreshToken();

      if (accessToken && !isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        setIsLoading(false);
        // Ensure cookie is in sync
        document.cookie = "hasSession=true; path=/; max-age=604800; SameSite=Lax";
        return;
      }

      // Access token is missing or expired, try to refresh
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', undefined, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });
          authSession.save(response.data.data);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        } catch {
          authSession.clear();
        }
      }

      setIsAuthenticated(false);
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = publicPaths.includes(pathname);

    if (isAuthenticated && isPublicPath) {
      // Logged in user shouldn't visit login/register/otp/landing
      router.replace('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      // Guest shouldn't visit private pages (like dashboard)
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
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
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
