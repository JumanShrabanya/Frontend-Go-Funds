'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Box, Button, Container, Grid, Stack, Typography, Alert, CircularProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../../../src/api/auth.api';

// Reusable 6-digit OTP input component
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = value.split('');
    newOtp[index] = char;
    onChange(newOtp.join(''));
    if (char && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }
  };

  return (
    <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', my: 4 }}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          id={`reset-otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          style={{
            width: '50px', height: '60px',
            textAlign: 'center', fontSize: '1.5rem', fontWeight: 600,
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.15)',
            borderRadius: '12px',
            color: '#2563EB', outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#2563EB';
            e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(15, 23, 42, 0.15)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ))}
    </Stack>
  );
}

const schema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});
type FormData = z.infer<typeof schema>;

function ResetOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) router.push('/auth/forgot-password');
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      const response = await authApi.verifyResetOtp({ email, otp: data.otp });
      const resetToken = response.data.data.resetToken;
      router.push(`/auth/reset-password?token=${encodeURIComponent(resetToken)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code.');
    }
  };

  const handleResend = async () => {
    try {
      setResendStatus(null);
      await authApi.forgotPassword({ email });
      setResendStatus({ type: 'success', message: 'A new reset code has been sent.' });
      setCountdown(60);
    } catch (err: unknown) {
      setResendStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to resend.' });
    }
  };

  return (
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
          <Typography variant="h2" sx={{ mb: 2, maxWidth: 400, color: '#0F172A' }}>
            Check your inbox.
          </Typography>
          <Typography variant="body1" sx={{ color: '#475569', maxWidth: 380, fontSize: '1.1rem' }}>
            We've sent a 6-digit reset code to your email. It expires in a few minutes.
          </Typography>
        </Box>
        <Box />
      </Grid>

      {/* Right: OTP Form Panel */}
      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          bgcolor: '#FFFFFF',
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Box>
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, color: '#0F172A' }}>
                Enter your reset code
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.05rem' }}>
                We sent a 6-digit code to{' '}
                <Typography component="span" sx={{ color: '#2563EB', fontWeight: 600 }}>{email}</Typography>
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>{error}</Alert>}
            {resendStatus && (
              <Alert severity={resendStatus.type} sx={{ width: '100%', borderRadius: 2 }}>
                {resendStatus.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => <OtpInput value={field.value} onChange={field.onChange} />}
              />
              {errors.otp && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                  {errors.otp.message}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  py: 1.8, mb: 3, fontSize: '1.05rem', borderRadius: 3,
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(37,99,235,0.45)' },
                }}
              >
                {isSubmitting ? 'Verifying…' : 'Verify code'}
              </Button>

              <Typography variant="body1" sx={{ color: '#64748B' }}>
                Didn't receive it?{' '}
                {countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <Typography
                    component="span"
                    onClick={handleResend}
                    sx={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  >
                    Resend code
                  </Typography>
                )}
              </Typography>
            </form>

            <Typography variant="body2" sx={{ color: '#64748B' }}>
              <Link href="/auth/forgot-password" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                ← Use a different email
              </Link>
            </Typography>
          </Stack>
        </Container>
      </Grid>
    </Grid>
  );
}

export default function ResetOtpPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
      <Suspense fallback={<Box sx={{ m: 'auto' }}><CircularProgress sx={{ color: '#2563EB' }} /></Box>}>
        <ResetOtpContent />
      </Suspense>
    </Box>
  );
}
