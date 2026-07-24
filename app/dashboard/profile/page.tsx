'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, Button, Alert, Stack, InputAdornment
} from '@mui/material';
import { useAuth } from '../../../src/components/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usersApi } from '../../../src/api/users.api';
import { PersonOutlined as PersonOutlineIcon } from '@mui/icons-material';

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100, 'Must not exceed 100 characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(100, 'Must not exceed 100 characters'),
  dateOfBirth: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date'),
  annualIncome: z.string().optional().refine(val => !val || !isNaN(Number(val)), 'Invalid income').refine(val => !val || Number(val) >= 0, 'Income cannot be negative'),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, updateUserSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      annualIncome: '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth || '',
        annualIncome: user.annualIncome?.toString() || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      setSuccess(false);

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth || undefined,
        annualIncome: data.annualIncome !== undefined ? Number(data.annualIncome) : undefined,
      };

      const updatedUser = await usersApi.updateProfile(payload);
      updateUserSession(updatedUser);
      setSuccess(true);
      
      reset(data);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2,
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}>
          <PersonOutlineIcon sx={{ color: '#FFF' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            My Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Manage your personal information
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ 
        bgcolor: '#FFFFFF', 
        borderRadius: 3, 
        p: { xs: 3, md: 4 }, 
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
      }}>
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Profile updated successfully!</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            
            {/* Email Address - Read Only */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, mb: 1 }}>
                Email Address (Read Only)
              </Typography>
              <TextField
                fullWidth
                value={user.email}
                disabled
                sx={{ 
                  '& .MuiOutlinedInput-root': { bgcolor: '#F8FAFC' },
                  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#64748B' }
                }}
              />
            </Grid>

            {/* First Name & Last Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, mb: 1 }}>
                First Name
              </Typography>
              <TextField
                fullWidth
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, mb: 1 }}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, mb: 1 }}>
                Date of Birth
              </Typography>
              <TextField
                fullWidth
                type="date"
                {...register('dateOfBirth')}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Annual Income */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" sx={{ color: '#0F172A', fontWeight: 600, mb: 1 }}>
                Annual Income
              </Typography>
              <TextField
                fullWidth
                type="number"
                {...register('annualIncome')}
                error={!!errors.annualIncome}
                helperText={errors.annualIncome?.message}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || isSubmitting}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: '#0F172A',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#1E293B',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#E2E8F0',
                    color: '#94A3B8'
                  }
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
