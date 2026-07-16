'use client';

import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import FlagIcon from '@mui/icons-material/Flag';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const MotionBox = motion(Box);

const steps = [
  {
    number: '01',
    icon: <PersonAddAltIcon sx={{ fontSize: 32 }} />,
    title: 'Create Your Account',
    description: 'Sign up in under 2 minutes. Complete your investor profile with your income, age, and financial goals.',
  },
  {
    number: '02',
    icon: <FlagIcon sx={{ fontSize: 32 }} />,
    title: 'Set Your Goals',
    description: 'Tell us what you are investing for — retirement, a home, education, or wealth creation. We build your plan.',
  },
  {
    number: '03',
    icon: <RocketLaunchIcon sx={{ fontSize: 32 }} />,
    title: 'Start Investing',
    description: 'Receive your personalised fund recommendations, set up your SIP, and watch your wealth compound over time.',
  },
];

export default function HowItWorksSection() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 10, md: 14 }, position: 'relative', bgcolor: '#F8FAFC' }}>
      {/* Subtle line separator */}
      <Box sx={{
        position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(15,23,42,0.06), transparent)',
      }} />

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mb: 12 }}>
          <Typography variant="caption" sx={{ color: 'secondary.main', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            How It Works
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, maxWidth: 600 }}>
            From zero to investor in{' '}
            <Box component="span" sx={{ color: 'secondary.main' }}>3 simple steps</Box>
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, position: 'relative' }}>
          {/* Connecting line (desktop only) */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute', top: 48, left: '16%', right: '16%',
            height: 2,
            background: 'linear-gradient(90deg, #10B981, transparent 40%, transparent 60%, #10B981)',
            opacity: 0.15,
          }} />

          {steps.map((step, i) => (
            <MotionBox
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              sx={{ flex: 1, textAlign: 'center', px: { xs: 2, md: 4 } }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                <Box sx={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'secondary.main',
                  position: 'relative', zIndex: 1,
                }}>
                  {step.icon}
                </Box>
                {/* Number badge */}
                <Box sx={{
                  position: 'absolute', top: -4, right: -4, zIndex: 2,
                  width: 32, height: 32, borderRadius: '50%',
                  bgcolor: 'secondary.main', color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 600,
                }}>
                  {i + 1}
                </Box>
              </Box>

              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                {step.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, maxWidth: 300, mx: 'auto' }}>
                {step.description}
              </Typography>
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
