'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';

import { PLANNER_STEPS } from '@/src/components/planner/plannerSteps';
import NumberQuestion from '@/src/components/planner/NumberQuestion';
import ChoiceQuestion from '@/src/components/planner/ChoiceQuestion';
import PlanResultView from '@/src/components/planner/PlanResultView';
import { PlannerFormData, PlanResult } from '@/src/types/planner.types';
import { guestPlannerApi } from '@/src/api/guest.api';

// Map frontend values to backend enum values
const GOAL_MAP: Record<string, string> = {
  wealth_creation: 'WEALTH_CREATION',
  retirement: 'RETIREMENT',
  house_purchase: 'HOME_PURCHASE',
  child_education: 'CHILD_EDUCATION',
  emergency_fund: 'WEALTH_CREATION', // fallback as backend doesn't have this
  tax_saving: 'TAX_SAVING',
};

const HORIZON_MAP: Record<string, string> = {
  less_than_3_years: 'LESS_THAN_3_YEARS',
  '3_to_5_years': 'THREE_TO_FIVE_YEARS',
  '5_to_10_years': 'FIVE_TO_TEN_YEARS',
  more_than_10_years: 'MORE_THAN_10_YEARS',
};

const RISK_MAP: Record<string, string> = {
  sell: 'CONSERVATIVE',
  wait: 'MODERATE',
  buy_more: 'AGGRESSIVE',
};

const INITIAL_FORM: PlannerFormData = {
  age: '',
  monthlyIncome: '',
  monthlyInvestment: '',
  goal: '',
  horizon: '',
  marketFallReaction: '',
  investmentExperience: '',
  emergencyFund: '',
  investmentMode: '',
};

export default function GuestPlannerPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);
  const [form, setForm] = useState<PlannerFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PlannerFormData, string>>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const totalSteps = PLANNER_STEPS.length;
  const currentStep = PLANNER_STEPS[step];
  const progress = ((step) / totalSteps) * 100;

  const animateTo = useCallback((nextStep: number, dir: 'forward' | 'back') => {
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 280);
  }, []);

  const handleFieldChange = (field: keyof PlannerFormData, value: string) => {
    setForm((prev: PlannerFormData) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: typeof errors) => ({ ...prev, [field]: undefined }));
  };

  const validateCurrentStep = (overrideValue?: string): boolean => {
    const stepDef = PLANNER_STEPS[step];
    const rawValue = overrideValue !== undefined ? overrideValue : form[currentStep.field];
    const error = stepDef.validate(rawValue as string | number);
    if (error) {
      setErrors((prev) => ({ ...prev, [currentStep.field]: error }));
      return false;
    }
    return true;
  };

  const validateInvestmentVsIncome = (): string | null => {
    if (
      currentStep.field === 'monthlyInvestment' &&
      form.monthlyIncome !== '' &&
      Number(form.monthlyInvestment) > Number(form.monthlyIncome)
    ) {
      return 'Monthly investment cannot exceed your monthly income.';
    }
    return null;
  };

  const handleNext = async (overrideValue?: string) => {
    if (!validateCurrentStep(overrideValue)) return;

    const crossErr = validateInvestmentVsIncome();
    if (crossErr) {
      setErrors((prev) => ({ ...prev, monthlyInvestment: crossErr }));
      return;
    }

    if (step < totalSteps - 1) {
      animateTo(step + 1, 'forward');
    } else {
      await handleSubmit(overrideValue);
    }
  };

  const handleBack = () => {
    if (step > 0) animateTo(step - 1, 'back');
  };

  const handleSubmit = async (overrideValue?: string) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const finalForm = { ...form } as any;
      if (overrideValue !== undefined) {
        finalForm[currentStep.field as string] = overrideValue;
      }

      if (!finalForm.goal || !finalForm.horizon || finalForm.monthlyInvestment === '') {
        throw new Error('Please fill in all required fields');
      }

      const payload = {
        monthlyInvestment: Number(finalForm.monthlyInvestment),
        goal: GOAL_MAP[finalForm.goal] || finalForm.goal.toUpperCase(),
        investmentHorizon: HORIZON_MAP[finalForm.horizon] || finalForm.horizon.toUpperCase(),
        riskProfile: finalForm.marketFallReaction ? RISK_MAP[finalForm.marketFallReaction] : undefined,
      };

      const plan = await guestPlannerApi.generatePlan(payload);
      setResult(plan);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setApiError(msg);
      console.error('[GuestPlanner] Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setResult(null);
    setApiError(null);
    setStep(0);
  };

  if (result) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box
          sx={{
            position: 'relative',
            bgcolor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(15,23,42,0.08)',
            p: { xs: 3, md: 5 },
            pt: { xs: 8, md: 8 },
            boxShadow: '0 4px 40px rgba(15,23,42,0.06)',
            width: '100%',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/')}
            sx={{ position: 'absolute', top: 24, left: 24, color: '#64748B', textTransform: 'none', fontWeight: 600, '&:hover': { background: 'rgba(15,23,42,0.04)' } }}
          >
            Home
          </Button>
          <PlanResultView result={result} onReset={handleReset} />
        </Box>
      </Container>
    );
  }

  const slideStyle: React.CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? direction === 'forward'
        ? 'translateX(24px)'
        : 'translateX(-24px)'
      : 'translateX(0)',
    transition: 'opacity 0.28s ease, transform 0.28s ease',
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid rgba(15,23,42,0.07)',
          boxShadow: '0 4px 40px rgba(15,23,42,0.06)',
          overflow: 'hidden',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10, color: '#64748B', textTransform: 'none', fontWeight: 600, '&:hover': { background: 'rgba(15,23,42,0.04)' } }}
        >
          Home
        </Button>
        <Box sx={{ px: { xs: 3, md: 5 }, pt: 10, pb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>
                  {step + 1}
                </Typography>
              </Box>
              <Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.85rem' }}>
                Question {step + 1} of {totalSteps}
              </Typography>
            </Box>
            <Typography sx={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 500 }}>
              {totalSteps - step - 1} {totalSteps - step - 1 === 1 ? 'question' : 'questions'} left
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 10,
              backgroundColor: 'rgba(15,23,42,0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 10,
                background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            }}
          />
        </Box>

        <Box
          sx={{
            px: { xs: 3, md: 5 },
            pb: 5,
            minHeight: 360,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box style={slideStyle}>
            {currentStep.type === 'number' ? (
              <NumberQuestion
                question={currentStep.question}
                tagline={currentStep.tagline}
                helpText={currentStep.helpText}
                prefix={currentStep.prefix}
                suffix={currentStep.suffix}
                min={currentStep.min}
                max={currentStep.max}
                value={form[currentStep.field] as string | number}
                error={errors[currentStep.field] ?? null}
                onChange={(val) => handleFieldChange(currentStep.field, val)}
                onSubmit={() => handleNext()}
              />
            ) : (
              <ChoiceQuestion
                question={currentStep.question}
                tagline={currentStep.tagline}
                options={currentStep.options ?? []}
                value={form[currentStep.field] as string}
                error={errors[currentStep.field] ?? null}
                onChange={(val) => handleFieldChange(currentStep.field, val)}
                onSubmit={(val?: string) => handleNext(val)}
              />
            )}
          </Box>

          {apiError && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: '10px',
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
              }}
            >
              <Typography sx={{ color: '#E11D48', fontSize: '0.85rem', fontWeight: 500 }}>
                {apiError}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(15,23,42,0.06)' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              disabled={step === 0}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#64748B',
                opacity: step === 0 ? 0 : 1,
                pointerEvents: step === 0 ? 'none' : 'auto',
                '&:hover': { background: 'rgba(15,23,42,0.04)' },
              }}
            >
              Back
            </Button>

            {currentStep.type === 'number' && (
              <Button
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                  ) : (
                    <ArrowForwardIcon />
                  )
                }
                onClick={() => handleNext()}
                disabled={isSubmitting}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.3)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': { background: '#CBD5E1', color: '#94A3B8', boxShadow: 'none' },
                }}
              >
                {isSubmitting
                  ? 'Generating...'
                  : step === totalSteps - 1
                  ? 'Generate My Plan'
                  : 'Continue'}
              </Button>
            )}

            {currentStep.type === 'choice' && (
              <Button
                endIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <ArrowForwardIcon />}
                onClick={() => handleNext()}
                disabled={isSubmitting || !form[currentStep.field]}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    boxShadow: '0 8px 20px rgba(15,23,42,0.3)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': { background: '#CBD5E1', color: '#94A3B8', boxShadow: 'none' },
                }}
              >
                {isSubmitting ? 'Generating...' : step === totalSteps - 1 ? 'Generate My Plan' : 'Continue'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
