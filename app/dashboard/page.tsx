'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

import StatCard from '../../src/components/dashboard/StatCard';
import MarketTrendChart from '../../src/components/dashboard/MarketTrendChart';
import CategoryDistributionChart from '../../src/components/dashboard/CategoryDistributionChart';
import TopFundsTable from '../../src/components/dashboard/TopFundsTable';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5, letterSpacing: -0.5 }}>
            Market Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Track broad market performance and discover top-performing categories.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/planner')}
          sx={{
            bgcolor: '#0F172A',
            color: '#FFFFFF',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)',
            '&:hover': {
              bgcolor: '#1E293B',
              boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)',
            }
          }}
        >
          Generate Investment Plan
        </Button>
      </Box>

      {/* Stats Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <StatCard 
            title="NIFTY 50" 
            value="23,500.20" 
            subtitle="vs Last Month" 
            trend="up" 
            trendValue="+2.4%" 
            icon={<ShowChartIcon />} 
            color="#2563EB"
          />
        </Box>
        <Box>
          <StatCard 
            title="Total Active Funds" 
            value="15,420" 
            subtitle="Tracked by AMFI" 
            trend="neutral" 
            trendValue="--" 
            icon={<AccountBalanceIcon />} 
            color="#8B5CF6"
          />
        </Box>
        <Box>
          <StatCard 
            title="Top Sector" 
            value="Technology" 
            subtitle="Highest Inflow" 
            trend="up" 
            trendValue="+14.2%" 
            icon={<DataUsageIcon />} 
            color="#10B981"
          />
        </Box>
        <Box>
          <StatCard 
            title="Avg Large Cap Return" 
            value="18.5%" 
            subtitle="3 Year Annualized" 
            trend="down" 
            trendValue="-0.5%" 
            icon={<TimelineIcon />} 
            color="#F59E0B"
          />
        </Box>
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
        <Box>
          <MarketTrendChart />
        </Box>
        <Box>
          <CategoryDistributionChart />
        </Box>
      </Box>

      {/* Table Row */}
      <Box>
        <TopFundsTable />
      </Box>
      
    </Container>
  );
}
