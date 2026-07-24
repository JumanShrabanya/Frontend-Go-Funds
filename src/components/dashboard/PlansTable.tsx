'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Chip, IconButton, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Tooltip,
  LinearProgress,
} from '@mui/material';
import { ExpandMore, Delete, BarChart, TrendingUp, CalendarMonth, AccountBalance } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanResult } from '../../types/planner.types';
import { plannerApi } from '../../api/planner.api';

interface Props {
  plans: PlanResult[];
  onPlanDeleted: (planId: string) => void;
}

const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low_risk:    { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' },
  medium_risk: { bg: '#FFFBEB', text: '#92400E', border: '#FCD34D' },
  high_risk:   { bg: '#FFF1F2', text: '#9F1239', border: '#FDA4AF' },
};

const GOAL_LABELS: Record<string, string> = {
  wealth_creation: 'Wealth Creation',
  retirement: 'Retirement',
  house_purchase: 'House Purchase',
  child_education: "Child's Education",
  emergency_fund: 'Emergency Fund',
  tax_saving: 'Tax Saving',
};

const HORIZON_LABELS: Record<string, string> = {
  less_than_3_years: '< 3 Years',
  '3_to_5_years': '3–5 Years',
  '5_to_10_years': '5–10 Years',
  more_than_10_years: '10+ Years',
};

export default function PlansTable({ plans, onPlanDeleted }: Props) {
  const [expandedId, setExpandedId] = useState<string | false>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await plannerApi.deletePlan(deleteTargetId);
      onPlanDeleted(deleteTargetId);
      setDeleteTargetId(null);
    } catch (e) {
      console.error('Failed to delete plan', e);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const formatRisk = (risk: string) => {
    return risk.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (plans.length === 0) return null;

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 4, height: 28, bgcolor: '#2563EB', borderRadius: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
            My Investment Plans
          </Typography>
          <Chip label={`${plans.length} Active`} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #BFDBFE' }} />
        </Box>

        <AnimatePresence>
          {plans.map((plan, index) => {
            const riskStyle = RISK_COLORS[plan.riskProfile] ?? RISK_COLORS['medium_risk'];
            const allocations = plan.allocations;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                style={{ marginBottom: 16 }}
              >
                <Accordion
                  expanded={expandedId === plan.id}
                  onChange={(_, isExpanded) => setExpandedId(isExpanded ? plan.id : false)}
                  sx={{
                    borderRadius: '12px !important',
                    border: '1px solid rgba(15,23,42,0.08)',
                    boxShadow: expandedId === plan.id
                      ? '0 10px 25px -5px rgba(37,99,235,0.12)'
                      : '0 2px 4px -1px rgba(15,23,42,0.04)',
                    transition: 'box-shadow 0.3s',
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: '#64748B' }} />}
                    sx={{ px: 3, py: 2, '&:hover': { bgcolor: '#F8FAFC' }, transition: 'background 0.2s' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
                      {/* Goal Icon */}
                      <Box sx={{ width: 40, height: 40, bgcolor: '#EFF6FF', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BarChart sx={{ fontSize: 22, color: '#2563EB' }} />
                      </Box>

                      {/* Goal & Risk */}
                      <Box sx={{ flexGrow: 1, minWidth: 140 }}>
                        <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                          {GOAL_LABELS[plan.goalType] ?? plan.goalType}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip
                            label={formatRisk(plan.riskProfile)}
                            size="small"
                            sx={{ bgcolor: riskStyle.bg, color: riskStyle.text, border: `1px solid ${riskStyle.border}`, fontWeight: 600, fontSize: '0.72rem' }}
                          />
                          <Chip
                            icon={<CalendarMonth sx={{ fontSize: '14px !important', color: '#64748B !important' }} />}
                            label={HORIZON_LABELS[plan.horizon] ?? plan.horizon}
                            size="small"
                            sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 500, fontSize: '0.72rem' }}
                          />
                        </Box>
                      </Box>

                      {/* Stats */}
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', ml: 'auto' }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500, display: 'block' }}>Monthly</Typography>
                          <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                            {formatCurrency(Number(plan.monthlyAmount))}
                          </Typography>
                        </Box>
                        {allocations?.estimatedFutureValue && (
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500, display: 'block' }}>Est. Future Value</Typography>
                            <Typography sx={{ fontWeight: 700, color: '#10B981', fontSize: '0.95rem' }}>
                              {formatCurrency(allocations.estimatedFutureValue)}
                            </Typography>
                          </Box>
                        )}
                        {allocations?.expectedReturnRate && (
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500, display: 'block' }}>Exp. Return</Typography>
                            <Typography sx={{ fontWeight: 700, color: '#2563EB', fontSize: '0.95rem' }}>
                              {allocations.expectedReturnRate}% p.a.
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Delete */}
                      <Tooltip title="Delete Plan">
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setDeleteTargetId(plan.id); }}
                          sx={{ ml: 1, color: '#94A3B8', '&:hover': { color: '#EF4444', bgcolor: '#FFF1F2' }, flexShrink: 0 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                    {/* Fund Allocations Table */}
                    {allocations?.funds?.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalance sx={{ fontSize: 16 }} /> Recommended Funds
                        </Typography>
                        <TableContainer sx={{ borderRadius: 2, border: '1px solid rgba(15,23,42,0.08)' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>Fund Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', borderBottom: '1px solid rgba(15,23,42,0.08)', width: 160 }}>Allocation</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.78rem', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>Monthly</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {allocations.funds.map((fund, i) => (
                                <TableRow key={i} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#F8FAFC' } }}>
                                  <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', py: 1.5 }}>
                                    {fund.fundName}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '0.78rem', color: '#64748B', py: 1.5 }}>
                                    {fund.category}
                                  </TableCell>
                                  <TableCell sx={{ py: 1.5, width: 160 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={fund.percentage}
                                        sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#2563EB', borderRadius: 3 } }}
                                      />
                                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', minWidth: 38 }}>
                                        {fund.percentage}%
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#10B981', py: 1.5 }}>
                                    {formatCurrency(fund.monthlyAmount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}

                    {/* Explanation */}
                    {allocations?.explanation?.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 16 }} /> Strategy Insights
                        </Typography>
                        <Box sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 2, border: '1px solid rgba(15,23,42,0.06)' }}>
                          {allocations.explanation.map((line: string, i: number) => (
                            <Typography key={i} variant="body2" sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.83rem', mb: i < allocations.explanation.length - 1 ? 0.5 : 0 }}>
                              • {line}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#0F172A' }}>Delete Investment Plan?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748B' }}>
            This action cannot be undone. The plan and all its fund allocations will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTargetId(null)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : <Delete />}
            sx={{ textTransform: 'none', bgcolor: '#EF4444', fontWeight: 600, '&:hover': { bgcolor: '#DC2626' } }}
          >
            {deleting ? 'Deleting...' : 'Delete Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
