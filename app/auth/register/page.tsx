'use client';

import React, { useRef, useState } from 'react';
import {
  Box, Button, Container, Grid, Stack, TextField, Typography, Alert,
  InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '../../../src/api/auth.api';
import { isBackendPassword, passwordPolicy } from '../../../src/auth/password-policy';
import { PasswordRequirements } from '../../../src/components/auth/PasswordRequirements';

const nameSchema = z.string()
  .trim()
  .min(1, 'This field is required')
  .max(30, 'Must not exceed 30 characters');

const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.string().trim().min(1, 'Email address is required').max(254, 'Email address must not exceed 254 characters').email('Please enter a valid email address'),
  password: z.string()
    .min(passwordPolicy.minLength, 'Password must be at least 8 characters')
    .max(passwordPolicy.maxLength, 'Password must not exceed 64 characters')
    .refine(isBackendPassword, 'Use uppercase, lowercase, a number, and @$!%*?&^# only.'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirementsOpen, setPasswordRequirementsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordFieldsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });
  const password = watch('password');
  const handlePasswordFieldsBlur = () => {
    window.setTimeout(() => {
      if (!passwordFieldsRef.current?.contains(document.activeElement)) {
        setPasswordRequirementsOpen(false);
      }
    }, 0);
  };

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      const { confirmPassword: _confirmPassword, ...payload } = data;
      await authApi.register(payload);
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register account');
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
          {/* Ambient glow */}
          <Box sx={{
            position: 'absolute', top: '-10%', left: '-10%',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
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
              Go<span style={{ color: 'primary.main' }}>Funds</span>
            </Typography>
          </Link>

          <Box sx={{ zIndex: 1 }}>
            <Typography variant="h2" sx={{ mb: 2, maxWidth: 400, color: '#0F172A' }}>
              Start building your wealth today.
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', maxWidth: 380, fontSize: '1.1rem' }}>
              Join thousands of investors using AI-driven insights to achieve their financial goals faster.
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
              {/* Mobile logo */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 2 }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <TrendingUpIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Go<span style={{ color: 'primary.main' }}>Funds</span>
                  </Typography>
                </Link>
              </Box>

              <Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>Create Account</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link href="/auth/login" style={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                    Sign in here
                  </Link>
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="First Name"
                      required
                      autoComplete="given-name"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      slotProps={{ htmlInput: { maxLength: 30 } }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      required
                      autoComplete="family-name"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      slotProps={{ htmlInput: { maxLength: 30 } }}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    required
                    autoComplete="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{ htmlInput: { maxLength: 254 } }}
                  />

                  <Box ref={passwordFieldsRef} onFocusCapture={() => setPasswordRequirementsOpen(true)} onBlurCapture={handlePasswordFieldsBlur}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Password"
                        required
                        autoComplete="new-password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                          htmlInput: { maxLength: passwordPolicy.maxLength },
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />

                      <PasswordRequirements password={password} visible={passwordRequirementsOpen} />

                      <TextField
                        fullWidth
                        label="Confirm Password"
                        required
                        autoComplete="new-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        slotProps={{
                          htmlInput: { maxLength: passwordPolicy.maxLength },
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'} onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || !isValid}
                    sx={{ mt: 2, py: 1.8, fontSize: '1.05rem', borderRadius: 3 }}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
