'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar, Box, Button, Container, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(15, 23, 42, 0.05)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1.5 }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexGrow: 1 }}>
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary', letterSpacing: '-0.3px' }}>
                Go<span style={{ color: '#2563EB' }}>Funds</span>
              </Typography>
            </Link>

            {/* Desktop nav links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  href={link.href}
                  component="a"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  {link.label}
                </Button>
              ))}
              <Box sx={{ width: '1px', height: 20, bgcolor: 'divider', mx: 1 }} />
              <Button component={Link} href="/auth/login" variant="text" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>
                Login
              </Button>
              <Button component={Link} href="/auth/register" variant="contained" size="small">
                Get Started
              </Button>
            </Box>

            {/* Mobile menu icon */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: 280, bgcolor: 'background.paper', px: 2, pt: 2 } } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List>
          {navLinks.map((link) => (
            <ListItemButton key={link.label} href={link.href} component="a" onClick={() => setMobileOpen(false)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: 'auto', pb: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button component={Link} href="/auth/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
            Login
          </Button>
          <Button component={Link} href="/auth/register" variant="contained" fullWidth onClick={() => setMobileOpen(false)}>
            Get Started
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
