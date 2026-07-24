'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, Container, CircularProgress, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

import StatCard from '../../src/components/dashboard/StatCard';
import PlansTable from '../../src/components/dashboard/PlansTable';
import { plannerApi } from '../../src/api/planner.api';
import { DashboardStats, PlanResult } from '../../src/types/planner.types';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const SAMPLE_STATS: DashboardStats = {
  totalPlans: 3,
  totalMonthlyInvestment: 2500,
  riskAllocation: [
    { name: 'low_risk', value: 1 },
    { name: 'medium_risk', value: 1 },
    { name: 'high_risk', value: 1 },
  ],
};

const SAMPLE_PLANS: PlanResult[] = [
  {
    id: 'sample-1',
    riskProfile: 'medium_risk',
    goalType: 'wealth_creation',
    horizon: '5_to_10_years',
    monthlyAmount: 1000,
    allocations: {
      expectedReturnRate: 13,
      estimatedFutureValue: 105000,
      horizonYears: 7,
      funds: [
        { fundId: '1', fundName: 'HDFC Flexi Cap Fund', category: 'Flexi Cap', percentage: 40, monthlyAmount: 400 },
        { fundId: '2', fundName: 'ICICI Prudential Value Fund', category: 'Value', percentage: 35, monthlyAmount: 350 },
        { fundId: '3', fundName: 'Axis Small Cap Fund', category: 'Small Cap', percentage: 25, monthlyAmount: 250 },
      ],
      explanation: [
        'A diversified flexi-cap core provides stability across market caps.',
        'Value fund adds a contrarian tilt to capture undervalued opportunities.',
        'Small-cap allocation boosts long-term growth potential.',
      ],
    },
    createdAt: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [plans, setPlans] = useState<PlanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSample, setShowSample] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, plansData] = await Promise.all([
        plannerApi.getDashboardStats(),
        plannerApi.getUserPlans(),
      ]);
      setStats(statsData);
      setPlans(plansData ?? []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlanDeleted = useCallback((planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    setStats(prev => {
      if (!prev) return prev;
      const deletedPlan = plans.find(p => p.id === planId);
      const newTotal = prev.totalPlans - 1;
      const newMonthly = prev.totalMonthlyInvestment - Number(deletedPlan?.monthlyAmount ?? 0);
      const newRisk = prev.riskAllocation
        .map(r => r.name === deletedPlan?.riskProfile ? { ...r, value: r.value - 1 } : r)
        .filter(r => r.value > 0);
      return { totalPlans: newTotal, totalMonthlyInvestment: newMonthly, riskAllocation: newRisk };
    });
  }, [plans]);

  const displayStats = showSample ? SAMPLE_STATS : stats;
  const displayPlans = showSample ? SAMPLE_PLANS : plans;
  const hasPlans = displayStats && displayStats.totalPlans > 0;

  const formatRiskName = (name: string) =>
    name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const chartData = displayStats?.riskAllocation?.map(item => ({
    name: formatRiskName(item.name),
    value: item.value,
  })) || [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5, letterSpacing: -0.5 }}>
            My Portfolio Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Track your active investment plans and portfolio distribution.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/dashboard/planner')}
          sx={{
            bgcolor: '#0F172A', color: '#FFFFFF', fontWeight: 600, textTransform: 'none',
            px: 3, py: 1.5, borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)',
            '&:hover': { bgcolor: '#1E293B', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)' },
          }}
        >
          Create New Plan
        </Button>
      </Box>

      {/* ── Empty State ── */}
      {!hasPlans ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <Box sx={{
            position: 'relative', overflow: 'hidden', bgcolor: '#FFFFFF', borderRadius: 4,
            p: { xs: 4, md: 10 }, textAlign: 'center',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
            mt: 4, background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          }}>
            <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0) 70%)' }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <Box sx={{ width: 100, height: 100, bgcolor: '#FFFFFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4, boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.2)', border: '1px solid rgba(37, 99, 235, 0.1)', position: 'relative' }}>
                  <ShowChartIcon sx={{ fontSize: 50, color: '#3B82F6' }} />
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: -5, right: -5, width: 24, height: 24, borderRadius: '50%', background: '#10B981', border: '3px solid #FFF' }} />
                </Box>
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 2, letterSpacing: -0.5 }}>
                Your financial future awaits.
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B', mb: 5, maxWidth: 500, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
                You haven't generated any investment plans yet. Let's create your first goal-based strategy and watch your portfolio come to life.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" onClick={() => router.push('/dashboard/planner')}
                  sx={{ bgcolor: '#2563EB', color: '#FFF', px: 4, py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: 'none', boxShadow: '0 10px 15px -3px rgba(37,99,235,0.3)', '&:hover': { bgcolor: '#1D4ED8', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                  Generate First Plan
                </Button>
                <Button variant="outlined" onClick={() => setShowSample(true)}
                  sx={{ borderColor: '#E2E8F0', color: '#475569', px: 4, py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: 'none', bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                  Preview Sample Dashboard
                </Button>
              </Stack>
            </Box>
          </Box>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {showSample && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#EFF6FF', color: '#1E3A8A', borderRadius: 2, border: '1px solid #BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>👁️ Viewing Sample Data</Typography>
              <Button size="small" onClick={() => setShowSample(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                Return to My Real Data
              </Button>
            </Box>
          )}

          {/* Top Row: 2 stat cards + donut chart all in one line */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1.2fr' }, gap: 3, mb: 4 }}>
            <StatCard title="Total Active Plans" value={displayStats.totalPlans.toString()} subtitle="Goal-based strategies" trend="neutral" trendValue="--" icon={<AccountBalanceIcon />} color="#8B5CF6" />
            <StatCard title="Total Monthly Investment" value={`₹${displayStats.totalMonthlyInvestment.toLocaleString('en-IN')}`} subtitle="Combined contributions" trend="neutral" trendValue="--" icon={<AccountBalanceWalletIcon />} color="#10B981" />

            {/* Compact Donut Chart Card */}
            <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 3, border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 4px 6px -1px rgba(15,23,42,0.04)', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5 }}>
                Risk Allocation
              </Typography>
              <Box sx={{ flex: 1, minHeight: 180 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} Plan(s)`, 'Count']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    <Legend verticalAlign="bottom" height={28} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>

          {/* Plans Detail Table */}
          <PlansTable plans={displayPlans} onPlanDeleted={handlePlanDeleted} />
        </motion.div>
      )}
    </Container>
  );
}
