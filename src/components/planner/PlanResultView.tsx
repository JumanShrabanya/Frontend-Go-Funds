'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import FlagIcon from '@mui/icons-material/Flag';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PlanResult } from '../../types/planner.types';

interface PlanResultViewProps {
  result: PlanResult;
  onReset: () => void;
}

const RISK_CONFIG: Record<string, { label: string; color: string; light: string; border: string; gradient: string }> = {
  conservative: {
    label: 'Conservative',
    color: '#16A34A',
    light: '#F0FDF4',
    border: '#86EFAC',
    gradient: 'linear-gradient(135deg, #16A34A, #15803D)',
  },
  moderate: {
    label: 'Moderate',
    color: '#D97706',
    light: '#FFFBEB',
    border: '#FCD34D',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
  },
  aggressive: {
    label: 'Aggressive',
    color: '#DC2626',
    light: '#FFF1F2',
    border: '#FCA5A5',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
  },
};

const GOAL_LABELS: Record<string, string> = {
  wealth_creation: 'Wealth Creation',
  retirement: 'Retirement',
  house_purchase: 'House Purchase',
  child_education: 'Child Education',
  emergency_fund: 'Emergency Fund',
  tax_saving: 'Tax Saving (ELSS)',
};

const HORIZON_LABELS: Record<string, string> = {
  less_than_3_years: 'Under 3 Years',
  '3_to_5_years': '3 – 5 Years',
  '5_to_10_years': '5 – 10 Years',
  more_than_10_years: 'Over 10 Years',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Large Cap': '#2563EB',
  'Mid Cap': '#7C3AED',
  'Small Cap': '#DB2777',
  'Liquid': '#0891B2',
  'ELSS': '#059669',
  'Flexi Cap': '#EA580C',
  'Multi Cap': '#9333EA',
  'Ultra Short': '#0284C7',
  'Dynamic Asset Allocation': '#4F46E5',
  'Other': '#64748B',
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? '#64748B';
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 200);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <Box sx={{ width: '100%', height: 6, borderRadius: 10, background: 'rgba(15,23,42,0.06)', overflow: 'hidden' }}>
      <Box
        sx={{
          height: '100%',
          borderRadius: 10,
          background: color,
          width: `${width}%`,
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </Box>
  );
}

export default function PlanResultView({ result, onReset }: PlanResultViewProps) {
  const { riskProfile, goalType, horizon, monthlyAmount, allocations } = result;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'GoFunds';
      const sheet = workbook.addWorksheet('Recommended Funds');

      // Define columns
      sheet.columns = [
        { header: 'Fund Name', key: 'name', width: 60 },
        { header: 'Category', key: 'category', width: 25 },
        { header: 'Allocation (%)', key: 'percentage', width: 15 },
        { header: 'Monthly SIP (₹)', key: 'amount', width: 20 },
      ];

      // Style header
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Add rows
      allocations.funds.forEach((fund) => {
        const row = sheet.addRow({
          name: fund.fundName,
          category: fund.category,
          percentage: Math.round(fund.percentage * 100),
          amount: fund.monthlyAmount,
        });
        
        row.getCell('percentage').alignment = { horizontal: 'center' };
        row.getCell('amount').alignment = { horizontal: 'right' };
        row.getCell('amount').numFmt = '₹#,##0';
      });

      // Generate and save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'GoFunds_Investment_Plan.xlsx');
    } catch (err) {
      console.error('Failed to generate Excel file', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Safety guard — should never happen but prevents crash if API shape changes
  if (!allocations || !allocations.funds) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: '#EF4444', fontWeight: 600 }}>
          Could not load plan details. Please try generating a new plan.
        </Typography>
        <Button onClick={onReset} sx={{ mt: 2 }}>Try Again</Button>
      </Box>
    );
  }

  const risk = RISK_CONFIG[riskProfile] ?? RISK_CONFIG.moderate;

  const totalInvested = Number(monthlyAmount) * allocations.horizonYears * 12;
  const wealthGain = allocations.estimatedFutureValue - totalInvested;
  const gainPct = totalInvested > 0 ? ((wealthGain / totalInvested) * 100).toFixed(0) : '0';

  return (
    <Box sx={{ animation: 'fadeInUp 0.5s ease forwards' }}>

      {/* ── Hero Header ────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mb: 5,
          pb: 4,
          borderBottom: '1px solid rgba(15,23,42,0.07)',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
            flexShrink: 0,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 32, color: '#fff' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.75rem' }, color: '#0F172A', lineHeight: 1.2, letterSpacing: -0.5 }}>
            Your Investment Plan is Ready
          </Typography>
          <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.95rem' }}>
            A personalised portfolio engineered around your goals and risk appetite.
          </Typography>
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: '10px',
            background: risk.light,
            border: `1.5px solid ${risk.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: risk.color }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: risk.color }}>
            {risk.label} Investor
          </Typography>
        </Box>
      </Box>

      {/* ── Main 2-Column Layout ──────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 4, alignItems: 'start' }}>

        {/* LEFT column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* ── Projection Banner ───────────────────── */}
          <Box
            sx={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
              border: '1px solid rgba(37,99,235,0.15)',
              p: { xs: 3, md: 4 },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(37,99,235,0.04)',
            }}
          >
            {/* decorative glow */}
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <Typography sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, mb: 2 }}>
              Projected Future Value
            </Typography>
            <Typography sx={{ fontSize: { xs: '2.2rem', md: '2.8rem' }, fontWeight: 800, color: '#059669', letterSpacing: -1, lineHeight: 1 }}>
              {formatCurrency(allocations.estimatedFutureValue)}
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mt: 1 }}>
              Over <strong style={{ color: '#0F172A' }}>{allocations.horizonYears} years</strong> at <strong style={{ color: '#0F172A' }}>{allocations.expectedReturnRate}% p.a.</strong> blended return
            </Typography>

            <Divider sx={{ borderColor: 'rgba(37,99,235,0.1)', my: 3 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { label: 'Total Invested', value: formatCurrency(totalInvested), icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />, color: '#0F172A' },
                { label: 'Estimated Gain', value: formatCurrency(wealthGain), icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, color: '#059669' },
                { label: 'Return Multiple', value: `${gainPct}%`, icon: <TimelineIcon sx={{ fontSize: 16 }} />, color: '#4F46E5' },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B', mb: 0.5 }}>
                    {stat.icon}
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#64748B' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Portfolio Allocations ─────────────────── */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 20, borderRadius: 4, background: 'linear-gradient(180deg, #2563EB, #7C3AED)' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
                Recommended Portfolio
              </Typography>
              <Chip
                label={`${allocations.funds.length} Funds`}
                size="small"
                sx={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.7rem', border: '1px solid #BFDBFE' }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {allocations.funds.map((fund, idx) => {
                const pct = Math.round(fund.percentage * 100);
                const catColor = getCategoryColor(fund.category);
                return (
                  <Box
                    key={fund.fundId}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: '16px',
                      border: '1.5px solid rgba(15,23,42,0.07)',
                      background: '#FAFAFA',
                      transition: 'all 0.22s ease',
                      '&:hover': {
                        background: '#fff',
                        boxShadow: '0 6px 24px rgba(15,23,42,0.07)',
                        borderColor: catColor + '40',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      {/* Rank badge */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '12px',
                          background: catColor + '15',
                          border: `1.5px solid ${catColor}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: catColor }}>
                          {pct}%
                        </Typography>
                      </Box>

                      {/* Fund details */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: '#0F172A',
                            lineHeight: 1.4,
                            mb: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {fund.fundName}
                        </Typography>
                        <Chip
                          label={fund.category}
                          size="small"
                          sx={{
                            background: catColor + '12',
                            color: catColor,
                            fontWeight: 600,
                            fontSize: '0.68rem',
                            height: 20,
                            border: `1px solid ${catColor}25`,
                          }}
                        />
                      </Box>

                      {/* Monthly amount */}
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                          ₹{fund.monthlyAmount.toLocaleString('en-IN')}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>/ month</Typography>
                      </Box>
                    </Box>

                    {/* Allocation bar */}
                    <AnimatedBar pct={pct} color={catColor} delay={idx * 100} />
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Why This Portfolio ───────────────────── */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 20, borderRadius: 4, background: 'linear-gradient(180deg, #F59E0B, #D97706)' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
                Why This Portfolio?
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {allocations.explanation.map((line, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: { xs: 2, md: 2.5 },
                    borderRadius: '12px',
                    background: '#FAFAFA',
                    border: '1px solid rgba(15,23,42,0.06)',
                    transition: 'background 0.2s ease',
                    '&:hover': { background: '#F1F5F9' },
                  }}
                >
                  <LightbulbOutlinedIcon sx={{ color: '#F59E0B', fontSize: 20, flexShrink: 0, mt: 0.1 }} />
                  <Typography sx={{ color: '#475569', lineHeight: 1.75, fontSize: '0.9rem' }}>
                    {line}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── CTA ──────────────────────────────────── */}
          <Box sx={{ display: 'flex', gap: 2, pt: 2, flexWrap: 'wrap' }}>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleDownloadExcel}
              disabled={isDownloading}
              variant="contained"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
                '&:hover': { background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', transform: 'translateY(-1px)' },
              }}
            >
              {isDownloading ? 'Generating...' : 'Download Plan (Excel)'}
            </Button>
            <Button
              startIcon={<AutorenewIcon />}
              onClick={onReset}
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                borderColor: 'rgba(15,23,42,0.15)',
                color: '#475569',
                '&:hover': { borderColor: '#2563EB', color: '#2563EB', background: '#EFF6FF' },
              }}
            >
              Generate Another Plan
            </Button>
          </Box>
        </Box>

        {/* RIGHT sidebar */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: { lg: 'sticky' }, top: { lg: 24 } }}>

          {/* Plan Summary Card */}
          <Box
            sx={{
              borderRadius: '20px',
              border: '1.5px solid rgba(15,23,42,0.08)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 3, py: 2.5, background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}>
              <Typography sx={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.95rem' }}>Plan Summary</Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.75rem', mt: 0.25 }}>Your profile at a glance</Typography>
            </Box>
            <Box sx={{ p: 2.5, background: '#fff', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { icon: <FlagIcon sx={{ fontSize: 16 }} />, label: 'Your Goal', value: GOAL_LABELS[goalType] ?? goalType, color: '#2563EB' },
                { icon: <TimelineIcon sx={{ fontSize: 16 }} />, label: 'Time Horizon', value: HORIZON_LABELS[horizon] ?? horizon, color: '#7C3AED' },
                { icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />, label: 'Monthly SIP', value: `₹${Number(monthlyAmount).toLocaleString('en-IN')}`, color: '#0F172A' },
                { icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, label: 'Risk Profile', value: risk.label, color: risk.color },
              ].map((item, i, arr) => (
                <Box key={item.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94A3B8' }}>
                      {item.icon}
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{item.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>
                      {item.value}
                    </Typography>
                  </Box>
                  {i < arr.length - 1 && <Divider sx={{ borderColor: 'rgba(15,23,42,0.05)' }} />}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Allocation donut visual */}
          <Box
            sx={{
              borderRadius: '20px',
              border: '1.5px solid rgba(15,23,42,0.08)',
              p: 3,
              background: '#fff',
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', mb: 2.5 }}>
              Allocation Breakdown
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {allocations.funds.map((fund) => {
                const pct = Math.round(fund.percentage * 100);
                const catColor = getCategoryColor(fund.category);
                return (
                  <Box key={fund.fundId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: catColor, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                          {fund.category}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                        {pct}%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 5, borderRadius: 10, background: 'rgba(15,23,42,0.06)' }}>
                      <Box
                        sx={{
                          height: '100%',
                          borderRadius: 10,
                          background: catColor,
                          width: `${pct}%`,
                          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Disclaimer */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: '14px',
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
            }}
          >
            <Typography sx={{ fontSize: '0.72rem', color: '#92400E', lineHeight: 1.7 }}>
              <strong>Disclaimer:</strong> This plan is generated algorithmically for educational purposes only and does not constitute regulated financial advice. Past performance is not indicative of future results. Please consult a SEBI-registered advisor before investing.
            </Typography>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
