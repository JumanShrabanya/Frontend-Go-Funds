'use client';

import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';

interface NumberQuestionProps {
  question: string;
  tagline: string;
  helpText?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  value: string | number;
  error: string | null;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function NumberQuestion({
  question,
  tagline,
  helpText,
  prefix,
  suffix,
  min,
  max,
  value,
  error,
  onChange,
  onSubmit,
}: NumberQuestionProps) {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5, lineHeight: 1.4 }}
      >
        {question}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: '#64748B', mb: 4, lineHeight: 1.7, maxWidth: 520 }}
      >
        {tagline}
      </Typography>

      <TextField
        fullWidth
        type="number"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onSubmit()}
        error={!!error}
        helperText={error || helpText}
        placeholder={min ? `e.g. ${min}` : ''}
        slotProps={{
          htmlInput: { min, max, autoFocus: true, style: { fontSize: '1.4rem', fontWeight: 600, padding: '16px 20px' } },
          input: {
            startAdornment: prefix ? (
              <InputAdornment position="start">
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#475569' }}>
                  {prefix}
                </Typography>
              </InputAdornment>
            ) : undefined,
            endAdornment: suffix ? (
              <InputAdornment position="end">
                <Typography sx={{ fontSize: '0.9rem', color: '#94A3B8' }}>
                  {suffix}
                </Typography>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          maxWidth: 420,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid rgba(15,23,42,0.12)',
            transition: 'all 0.2s ease',
            '& fieldset': { border: 'none' },
            '&:hover': { border: '1.5px solid rgba(37,99,235,0.5)' },
            '&.Mui-focused': {
              border: '1.5px solid #2563EB',
              boxShadow: '0 0 0 4px rgba(37,99,235,0.08)',
            },
            '&.Mui-error': { border: '1.5px solid #EF4444' },
          },
          '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': { display: 'none' },
        }}
      />
    </Box>
  );
}
