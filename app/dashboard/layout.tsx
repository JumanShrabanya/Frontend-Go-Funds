'use client';

import React from 'react';
import {
  Box, Container, Typography, Avatar, Button, IconButton,
  Tabs, Tab, Divider, Menu, MenuItem
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Find which tab index is active based on current path
  const activeTab = navLinks.findIndex(link =>
    link.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(link.href)
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <IconButton sx={{ color: '#64748B' }}>
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(15,23,42,0.08)' }} />
              <Box
                onClick={handleMenuOpen}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 0.5, borderRadius: 2, '&:hover': { bgcolor: '#F1F5F9' } }}
              >
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#DBEAFE', color: '#1D4ED8', fontSize: '0.875rem', fontWeight: 700 }}>
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, lineHeight: 1.2, fontSize: '0.875rem' }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Account
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* User Popover Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{ paper: { sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: '0 10px 25px -5px rgba(15,23,42,0.1)' } } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => logout()} sx={{ color: '#EF4444', fontWeight: 600, fontSize: '0.875rem' }}>
              Sign Out
            </MenuItem>
          </Menu>

          {/* Nav Tabs — scrollable on mobile */}
          <Tabs
            value={activeTab === -1 ? false : activeTab}
            onChange={(_, newVal) => router.push(navLinks[newVal].href)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 44,
              '& .MuiTabs-scrollButtons': {
                width: 28,
                '&.Mui-disabled': { opacity: 0.3 },
              },
              '& .MuiTabs-indicator': {
                height: 2,
                borderRadius: '2px 2px 0 0',
                bgcolor: '#0F172A',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.825rem', sm: '0.9rem' },
                color: '#64748B',
                minHeight: 44,
                px: { xs: 1.5, sm: 2 },
                minWidth: 'auto',
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
