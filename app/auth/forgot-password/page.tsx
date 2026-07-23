'use client';

import React, { useState } from 'react';
import {
  Box, Button, Container, Grid, Stack, TextField, Typography, Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LockResetIcon from '@mui/icons-material/LockReset';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../../../src/api/auth.api';

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      await authApi.forgotPassword({ email: data.email });
      setSuccess(true);
      // Redirect to OTP page after short delay
      setTimeout(() => {
        router.push(`/auth/reset-otp?email=${encodeURIComponent(data.email)}`);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left: Branding Panel */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
            borderRight: '1px solid rgba(15, 23, 42, 0.08)',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{
            position: 'absolute', bottom: '-10%', right: '-10%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />

          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}>
              <TrendingUpIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, letterSpacing: '-0.3px' }}>
              GoFunds
            </Typography>
          </Link>

          <Box sx={{ zIndex: 1 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '16px', mb: 3,
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LockResetIcon sx={{ fontSize: 32, color: '#2563EB' }} />
            </Box>
            <Typography variant="h2" sx={{ mb: 2, maxWidth: 400, color: '#0F172A' }}>
              Forgot your password?
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', maxWidth: 380, fontSize: '1.1rem' }}>
              No worries. Enter your email and we'll send you a secure reset code.
            </Typography>
          </Box>
          <Box />
        </Grid>

        {/* Right: Form Panel */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            p: { xs: 3, sm: 6 },
            bgcolor: '#FFFFFF',
          }}
        >
          <Container maxWidth="sm">
            <Stack spacing={4}>
              <Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, color: '#0F172A' }}>
                  Reset password
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.05rem' }}>
                  Enter the email address associated with your account and we'll send you a one-time code.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  Reset code sent! Redirecting you to verify…
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    {...register('email')}
                    label="Email address"
                    type="email"
                    fullWidth
                    autoFocus
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting || success}
                    sx={{
                      py: 1.8, fontSize: '1.05rem', borderRadius: 3,
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                      '&:hover': { boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
                    }}
                  >
                    {isSubmitting ? 'Sending code…' : 'Send reset code'}
                  </Button>
                </Stack>
              </form>

              <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748B' }}>
                Remembered it?{' '}
                <Link href="/auth/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                  Back to login
                </Link>
              </Typography>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
