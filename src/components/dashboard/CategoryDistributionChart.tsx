'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Small Cap', return: 28.5 },
  { name: 'Mid Cap', return: 22.1 },
  { name: 'Large Cap', return: 18.5 },
  { name: 'Flexi Cap', return: 20.4 },
  { name: 'ELSS', return: 19.2 },
  { name: 'Hybrid', return: 12.5 },
  { name: 'Debt', return: 7.2 },
];

export default function CategoryDistributionChart() {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)', height: 400 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 3 }}>
        Avg 3Y Returns by Category (%)
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 11 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <Tooltip 
            cursor={{ fill: '#F1F5F9' }}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="return" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.return > 15 ? '#10B981' : '#64748B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
