'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export default function PlannerPage() {
  const router = useRouter();

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => router.push('/dashboard')}
        sx={{ mb: 3, color: '#64748B', textTransform: 'none', fontWeight: 600 }}
      >
        Back to Overview
      </Button>

      <Box sx={{ bgcolor: '#FFFFFF', p: 8, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
          Investment Plan Generator
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 600, mx: 'auto' }}>
          This page is under construction. The plan generator interface will be built here in the next phase.
        </Typography>
      </Box>
    </Container>
  );
}
