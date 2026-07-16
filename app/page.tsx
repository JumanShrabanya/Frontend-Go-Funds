'use client';

import React from 'react';
import Navbar from '../src/components/layout/Navbar';
import HeroSection from '../src/components/sections/HeroSection';
import FeaturesSection from '../src/components/sections/FeaturesSection';
import HowItWorksSection from '../src/components/sections/HowItWorksSection';
import CtaSection from '../src/components/sections/CtaSection';
import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        py: 5,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '8px',
              background: 'linear-gradient(135deg, #4ECDC4, #00897B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: '#080E1A' }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
              Go<span style={{ color: '#4ECDC4' }}>Funds</span>
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} GoFunds. All rights reserved. Investments are subject to market risks.
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacy', 'Terms', 'Support'].map((item) => (
              <Typography key={item} variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: '#4ECDC4' }, transition: 'color 0.2s' }}>
                {item}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </Box>
  );
}
