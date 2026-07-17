'use client';

import React from 'react';
import {
  Box, Container, Typography, Avatar, Button, IconButton,
  Tabs, Tab, Divider
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAuth } from '../../src/components/providers/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Fund Explorer', href: '/dashboard/funds' },
  { label: 'Watchlist', href: '/dashboard/watchlist' },
  { label: 'Portfolio', href: '/dashboard/portfolio' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Find which tab index is active based on current path
  const activeTab = navLinks.findIndex(link =>
    link.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(link.href)
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <Box
        component="header"
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          {/* Brand + User row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'linear-gradient(135deg, #0F172A, #334155)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ color: '#FFF', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>G</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 800, letterSpacing: -0.5 }}>
                GoFunds
              </Typography>
            </Box>

            {/* Right controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton sx={{ color: '#64748B' }}>
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(15,23,42,0.08)' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.875rem', fontWeight: 700 }}>
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, lineHeight: 1.2, fontSize: '0.875rem' }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#94A3B8', cursor: 'pointer', '&:hover': { color: '#ef4444' } }}
                    onClick={() => logout()}
                  >
                    Sign Out
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Nav Tabs — sit flush at the bottom of the header */}
          <Tabs
            value={activeTab === -1 ? false : activeTab}
            onChange={(_, newVal) => router.push(navLinks[newVal].href)}
            sx={{
              minHeight: 44,
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: '#0F172A',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                color: '#64748B',
                minHeight: 44,
                px: 1.5,
                '&.Mui-selected': { color: '#0F172A', fontWeight: 600 },
              },
            }}
          >
            {navLinks.map(link => (
              <Tab key={link.href} label={link.label} disableRipple />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Page Content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
