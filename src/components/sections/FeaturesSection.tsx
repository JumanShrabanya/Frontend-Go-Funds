'use client';

import React from 'react';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShieldIcon from '@mui/icons-material/Shield';
import InsightsIcon from '@mui/icons-material/Insights';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const MotionBox = motion(Box);

const features = [
  {
    icon: <AutoGraphIcon />,
    title: 'AI-Powered Plans',
    description: 'Our engine analyses your income, age, and risk tolerance to recommend the optimal mutual fund mix tailored just for you.',
    color: '#2563EB',
  },
  {
    icon: <TrackChangesIcon />,
    title: 'Goal-Based Investing',
    description: 'Set clear goals — retirement, home, education — and get a structured SIP plan that keeps you exactly on track.',
    color: '#10B981',
  },
  {
    icon: <InsightsIcon />,
    title: 'Real-Time Analytics',
    description: 'Live portfolio tracking with interactive charts, XIRR calculations, and performance benchmarks against market indices.',
    color: '#2563EB',
  },
  {
    icon: <AccountBalanceIcon />,
    title: 'Diversified Portfolio',
    description: 'We spread your investments across equity, debt, and hybrid funds to balance returns and shield against market volatility.',
    color: '#10B981',
  },
  {
    icon: <ShieldIcon />,
    title: 'Bank-Grade Security',
    description: 'End-to-end encryption, two-factor authentication, and read-only integrations ensure your data is always safe.',
    color: '#2563EB',
  },
  {
    icon: <NotificationsActiveIcon />,
    title: 'Smart Alerts',
    description: 'Get notified when your SIP is due, when a fund underperforms, or when rebalancing your portfolio can boost returns.',
    color: '#10B981',
  },
];

export default function FeaturesSection() {
  return (
    <Box id="features" sx={{ py: { xs: 10, md: 14 }, position: 'relative', bgcolor: '#FFFFFF' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mb: 10 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Why GoFunds
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, maxWidth: 600 }}>
            Everything you need to{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>invest confidently</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, fontSize: '1.05rem' }}>
            From first-time investors to seasoned professionals, GoFunds adapts to every stage of your financial journey.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {features.map((feature, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
              <MotionBox
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}
                sx={{
                  p: 4,
                  height: '100%',
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 23, 42, 0.06)',
                  borderRadius: 4,
                  cursor: 'default',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                }}
              >
                <Box
                  sx={{
                    width: 56, height: 56, borderRadius: 3, mb: 3,
                    bgcolor: `${feature.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: feature.color,
                  }}
                >
                  {React.cloneElement(
                    feature.icon as React.ReactElement<{ sx?: { fontSize: number } }>,
                    { sx: { fontSize: 28 } },
                  )}
                </Box>
                <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
