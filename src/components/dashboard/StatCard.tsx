import React from 'react';
import { Box, Typography, Stack, SvgIconProps } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ReactElement<SvgIconProps>;
  color: string;
}

export default function StatCard({ title, value, subtitle, trend, trendValue, icon, color }: StatCardProps) {
  const isUp = trend === 'up';
  
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        p: 3,
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ color: '#0F172A', fontWeight: 800 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Stack>
      
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
        <Box
          sx={{
            bgcolor: trend === 'neutral' ? '#F1F5F9' : (isUp ? '#DCFCE7' : '#FEE2E2'),
            color: trend === 'neutral' ? '#475569' : (isUp ? '#16A34A' : '#DC2626'),
            px: 1,
            py: 0.25,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {trendValue}
        </Box>
        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
          {subtitle}
        </Typography>
      </Stack>
    </Box>
  );
}
