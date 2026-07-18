'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', NIFTY50: 21500, TopFundsAvg: 21200 },
  { name: 'Feb', NIFTY50: 21800, TopFundsAvg: 22100 },
  { name: 'Mar', NIFTY50: 21950, TopFundsAvg: 22600 },
  { name: 'Apr', NIFTY50: 22300, TopFundsAvg: 23100 },
  { name: 'May', NIFTY50: 22100, TopFundsAvg: 23400 },
  { name: 'Jun', NIFTY50: 22800, TopFundsAvg: 24200 },
  { name: 'Jul', NIFTY50: 23500, TopFundsAvg: 25100 },
];

export default function MarketTrendChart() {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)', height: 400 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 3 }}>
        Market Trend: NIFTY 50 vs Top Funds
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="TopFundsAvg" 
            stroke="#2563EB" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="NIFTY50" 
            stroke="#94A3B8" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
