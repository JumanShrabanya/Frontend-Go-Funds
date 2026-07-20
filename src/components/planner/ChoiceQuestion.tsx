'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChoiceOption } from './plannerSteps';

interface ChoiceQuestionProps {
  question: string;
  tagline: string;
  options: ChoiceOption[];
  value: string;
  error: string | null;
  onChange: (val: string) => void;
  onSubmit: (val?: string) => void;
}

export default function ChoiceQuestion({
  question,
  tagline,
  options,
  value,
  error,
  onChange,
  onSubmit,
}: ChoiceQuestionProps) {
  const handleSelect = (optValue: string) => {
    onChange(optValue);
    // Auto-advance after brief visual feedback
    setTimeout(() => onSubmit(optValue), 200);
  };

  const cols = options.length <= 3 ? options.length : 2;

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

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: options.length <= 3 ? `repeat(${options.length}, 1fr)` : 'repeat(3, 1fr)',
          },
          gap: 3,
          width: '100%',
        }}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <Box
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                border: isSelected
                  ? '2px solid #2563EB'
                  : '1.5px solid rgba(15,23,42,0.1)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.02) 100%)'
                  : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  border: '1.5px solid rgba(37,99,235,0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.1)',
                  background: 'rgba(37,99,235,0.02)',
                },
                '&:active': { transform: 'scale(0.98)' },
              }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </Box>
              )}

              <Box sx={{ mb: 1.5, color: isSelected ? '#2563EB' : '#64748B', display: 'flex' }}>
                {opt.icon}
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: isSelected ? '#2563EB' : '#0F172A',
                  mb: 0.5,
                }}
              >
                {opt.label}
              </Typography>
              {opt.description && (
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    color: '#94A3B8',
                    lineHeight: 1.5,
                  }}
                >
                  {opt.description}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {error && (
        <Typography sx={{ color: '#EF4444', fontSize: '0.8rem', mt: 1.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
