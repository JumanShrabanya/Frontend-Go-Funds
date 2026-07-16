'use client';

import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#FFFFFF' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 6, md: 10 },
              background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              borderRadius: 6,
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient light blobs */}
            <Box sx={{
              position: 'absolute', top: '-20%', left: '20%',
              width: 500, height: 500, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <Box sx={{
              position: 'absolute', bottom: '-20%', right: '20%',
              width: 500, height: 500, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            <Stack spacing={3} sx={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3.5rem' }, maxWidth: 600 }}>
                Ready to grow your{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>wealth?</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, fontSize: '1.1rem' }}>
                Join over 12,000 investors who are already building their financial future with GoFunds. No fees to get started.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  href="/auth/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 5, py: 1.8, fontSize: '1.05rem', borderRadius: 3 }}
                >
                  Create Free Account
                </Button>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="outlined"
                  size="large"
                  sx={{ px: 5, py: 1.8, fontSize: '1.05rem', borderRadius: 3 }}
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
