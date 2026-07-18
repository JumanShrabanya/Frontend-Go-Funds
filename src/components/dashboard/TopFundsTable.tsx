import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const topFunds = [
  { id: 1, name: 'Parag Parikh Flexi Cap Fund', category: 'Equity - Flexi Cap', risk: 'Very High', nav: '₹75.42', return1Y: 34.2, return3Y: 22.4 },
  { id: 2, name: 'SBI Small Cap Fund', category: 'Equity - Small Cap', risk: 'Very High', nav: '₹182.15', return1Y: 41.5, return3Y: 28.5 },
  { id: 3, name: 'Quant Active Fund', category: 'Equity - Multi Cap', risk: 'Very High', nav: '₹624.80', return1Y: 38.1, return3Y: 25.4 },
  { id: 4, name: 'HDFC Mid-Cap Opportunities', category: 'Equity - Mid Cap', risk: 'High', nav: '₹145.30', return1Y: 36.8, return3Y: 23.1 },
  { id: 5, name: 'Mirae Asset Tax Saver Fund', category: 'Equity - ELSS', risk: 'High', nav: '₹42.90', return1Y: 28.4, return3Y: 18.7 },
];

export default function TopFundsTable() {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 3 }}>
        Top Performing Funds
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>Fund Name</TableCell>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>Category</TableCell>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>Risk</TableCell>
              <TableCell sx={{ color: '#64748B', fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>NAV</TableCell>
              <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>1Y Return</TableCell>
              <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.08)' }}>3Y Return</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topFunds.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(37, 99, 235, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUpIcon sx={{ color: '#2563EB', fontSize: 16 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {row.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>{row.category}</TableCell>
                <TableCell>
                  <Chip label={row.risk} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontWeight: 600, fontSize: '0.7rem' }} />
                </TableCell>
                <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{row.nav}</TableCell>
                <TableCell align="right" sx={{ color: '#16A34A', fontWeight: 600 }}>+{row.return1Y}%</TableCell>
                <TableCell align="right" sx={{ color: '#16A34A', fontWeight: 600 }}>+{row.return3Y}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
