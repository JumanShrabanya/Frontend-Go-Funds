'use client';

import React from 'react';
import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';

const MotionBox = motion(Box);

function StatCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      sx={{
        px: 2.5, py: 2,
        background: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        border: '1px solid rgba(15, 23, 42, 0.04)',
        borderRadius: 3,
        minWidth: 120,
      }}
    >
      <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
    </MotionBox>
  );
}

export default function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 12, md: 8 },
        pb: { xs: 8, md: 4 },
      }}
    >
      {/* Background gradients for light mode */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <Box sx={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(15,23,42,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 6 } }}>
        <Grid container spacing={{ xs: 6, lg: 10 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              </MotionBox>

              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Typography
                  variant="h1"
                  sx={{ fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' }, color: 'text.primary', mb: 0 }}
                >
                  Invest smarter,{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    grow faster
                  </Box>
                </Typography>
              </MotionBox>

              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, fontSize: '1.1rem' }}>
                  Personalised mutual fund investment plans tailored to your income, risk appetite,
                  and financial goals — powered by intelligent analytics.
                </Typography>
              </MotionBox>

              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    Start for Free
                  </Button>
                  <Button
                    component="a"
                    href="#how-it-works"
                    variant="outlined"
                    size="large"
                    sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                  >
                    See How It Works
                  </Button>
                </Stack>
              </MotionBox>

              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }}>
                <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', mt: 2 }}>
                  <StatCard value="₹2.4Cr+" label="Assets Tracked" delay={0.4} />
                  <StatCard value="12,000+" label="Active Investors" delay={0.5} />
                  <StatCard value="18.6%" label="Avg. Annual Return" delay={0.6} />
                </Stack>
              </MotionBox>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            <MotionBox
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              sx={{
                width: '100%', maxWidth: { xs: 500, lg: 640 },
                background: '#FFFFFF',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.06)',
                border: '1px solid rgba(15, 23, 42, 0.05)',
                borderRadius: 4,
                p: 4,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>Portfolio Value</Typography>
                  <Typography variant="h3" sx={{ color: 'text.primary', mt: 0.5 }}>₹4,82,340</Typography>
                  <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 500, display: 'block', mt: 0.5 }}>▲ +12.4% this year</Typography>
                </Box>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUpIcon sx={{ color: 'secondary.main' }} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120, mb: 4 }}>
                {[40, 55, 45, 70, 60, 85, 75, 90, 80, 100, 88, 95].map((h, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1, borderRadius: '4px 4px 0 0',
                      height: `${h}%`,
                      background: i === 11
                        ? 'linear-gradient(180deg, #2563EB, #60A5FA)'
                        : `rgba(37, 99, 235, ${0.1 + (i / 11) * 0.2})`,
                      transition: 'height 0.3s ease',
                    }}
                  />
                ))}
              </Box>

              {[
                { name: 'Mirae Asset Large Cap', alloc: '40%', gain: '+14.2%' },
                { name: 'Parag Parikh Flexi Cap', alloc: '35%', gain: '+22.1%' },
                { name: 'ICICI Pru Balanced Adv.', alloc: '25%', gain: '+9.8%' },
              ].map((fund) => (
                <Box key={fund.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderTop: '1px solid rgba(15,23,42,0.04)' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>{fund.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{fund.alloc} allocation</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 500 }}>{fund.gain}</Typography>
                </Box>
              ))}
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box >
  );
}
