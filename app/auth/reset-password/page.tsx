'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Box, Button, Container, Grid, Stack, TextField, Typography, Alert,
  CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutlined as CheckCircleOutlineIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../../../src/api/auth.api';
import { passwordPolicy } from '../../../src/auth/password-policy';

const schema = z
  .object({
    password: z
      .string()
      .min(passwordPolicy.minLength, `Password must be at least ${passwordPolicy.minLength} characters`)
      .max(passwordPolicy.maxLength, `Password must not exceed ${passwordPolicy.maxLength} characters`)
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[@$!%*?&^#]/, 'Must contain at least one special character (@$!%*?&^#)'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

const requirements = [
  { label: `At least ${passwordPolicy.minLength} characters`, test: (p: string) => p.length >= passwordPolicy.minLength },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character (@$!%*?&^#)', test: (p: string) => /[@$!%*?&^#]/.test(p) },
];

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!resetToken) router.push('/auth/forgot-password');
  }, [resetToken, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      await authApi.resetPassword({ resetToken, password: data.password });
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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
            Create a strong password.
          </Typography>
          <Typography variant="body1" sx={{ color: '#475569', maxWidth: 380, fontSize: '1.1rem' }}>
            Your new password will replace your old one. All existing sessions will be signed out for your security.
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
                Set new password
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.05rem' }}>
                Choose a strong password you haven't used before.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Password reset successfully! Redirecting to login…
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                {/* New Password */}
                <TextField
                  {...register('password')}
                  label="New password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  autoFocus
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {/* Password Requirements */}
                <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 1, display: 'block' }}>
                    PASSWORD REQUIREMENTS
                  </Typography>
                  <Stack spacing={0.75}>
                    {requirements.map((req) => {
                      const met = req.test(passwordValue || '');
                      return (
                        <Stack key={req.label} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                          {met
                            ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                            : <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: '#CBD5E1' }} />
                          }
                          <Typography variant="caption" sx={{ color: met ? '#16A34A' : '#94A3B8', fontWeight: met ? 600 : 400 }}>
                            {req.label}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Confirm Password */}
                <TextField
                  {...register('confirmPassword')}
                  label="Confirm new password"
                  type={showConfirm ? 'text' : 'password'}
                  fullWidth
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                  {isSubmitting ? 'Resetting password…' : 'Reset password'}
                </Button>
              </Stack>
            </form>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748B' }}>
              <Link href="/auth/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                ← Back to login
              </Link>
            </Typography>
          </Stack>
        </Container>
      </Grid>
    </Grid>
  );
}

export default function ResetPasswordPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
      <Suspense fallback={<Box sx={{ m: 'auto' }}><CircularProgress sx={{ color: '#2563EB' }} /></Box>}>
        <ResetPasswordContent />
      </Suspense>
    </Box>
  );
}
