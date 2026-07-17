import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../providers/AuthProvider';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, active: true },
  { text: 'Fund Explorer', icon: <SearchIcon />, active: false },
  { text: 'Watchlist', icon: <ShowChartIcon />, active: false },
  { text: 'Portfolio', icon: <AccountBalanceWalletIcon />, active: false },
];

export default function DashboardSidebar() {
  const { logout } = useAuth();

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: '#FFFFFF',
        borderRight: '1px solid rgba(15, 23, 42, 0.08)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        zIndex: 1200,
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '8px',
          background: 'linear-gradient(135deg, #0F172A, #334155)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ color: '#FFF', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>G</Typography>
        </Box>
        <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 800, letterSpacing: -0.5 }}>
          GoFunds
        </Typography>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                bgcolor: item.active ? 'rgba(15, 23, 42, 0.04)' : 'transparent',
                color: item.active ? '#0F172A' : '#64748B',
                '&:hover': {
                  bgcolor: 'rgba(15, 23, 42, 0.04)',
                  color: '#0F172A'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: item.active ? 600 : 500,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: 'rgba(15, 23, 42, 0.08)' }} />
        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton sx={{ borderRadius: 2, color: '#64748B', '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.04)', color: '#0F172A' } }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' } }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
