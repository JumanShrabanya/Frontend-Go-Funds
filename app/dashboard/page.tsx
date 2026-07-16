'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { authApi } from '../../src/api/auth.api';
import { authSession } from '../../src/auth/auth-session';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic frontend protection
    const token = authSession.getAccessToken();
    if (!token) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    const refreshToken = authSession.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } finally {
      authSession.clear();
    }
    router.push('/');
  };

  if (loading) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrendingUpIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 600 }}>
                Go<span style={{ color: '#2563EB' }}>Funds</span> Dashboard
              </Typography>
            </Box>
            <Button variant="outlined" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Typography variant="h3" sx={{ mb: 2, color: '#0F172A' }}>
          Welcome to your Dashboard!
        </Typography>
        <Typography variant="body1" sx={{ color: '#475569', maxWidth: 600 }}>
          Your email has been successfully verified and you are now securely logged in. 
          The full dashboard layout and AI fund recommendations will be implemented in the next phase.
        </Typography>
      </Container>
    </Box>
  );
}
