import api from './axios.instance';
import { PlannerFormData, PlanResult, DashboardStats } from '../types/planner.types';

type BackendFund = {
  fundId: string;
  schemeName?: string;
  fundName?: string;
  mainCategory?: string;
  subCategory?: string;
  category?: string;
  allocationPercentage?: number;
  percentage?: number;
  monthlyAmount?: number;
  schemeCode?: string;
  fundHouse?: string;
};

type BackendPlan = {
  id: string;
  goal?: string;
  goalType?: string;
  investmentHorizon?: string;
  horizon?: string;
  monthlyAmount?: number;
  monthlyInvestment?: number;
  riskProfile?: string;
  allocationBreakdown?: Record<string, number>;
  recommendedFunds?: BackendFund[];
  totalInvested?: number;
  projectedValue?: number;
  projectedReturns?: number;
  explanation?: string | string[];
  status?: string;
  createdAt?: string;
  allocations?: PlanResult['allocations'];
};

const GOAL_MAP: Record<string, string> = {
  WEALTH_CREATION: 'wealth_creation',
  RETIREMENT: 'retirement',
  HOME_PURCHASE: 'house_purchase',
  HOUSE_PURCHASE: 'house_purchase',
  CHILD_EDUCATION: 'child_education',
  EMERGENCY_FUND: 'emergency_fund',
  TAX_SAVING: 'tax_saving',
};

const HORIZON_MAP: Record<string, string> = {
  LESS_THAN_3_YEARS: 'less_than_3_years',
  THREE_TO_FIVE_YEARS: '3_to_5_years',
  FIVE_TO_TEN_YEARS: '5_to_10_years',
  MORE_THAN_10_YEARS: 'more_than_10_years',
};

const HORIZON_YEARS: Record<string, number> = {
  less_than_3_years: 2,
  '3_to_5_years': 4,
  '5_to_10_years': 7,
  more_than_10_years: 15,
};

function normalizePlan(raw: BackendPlan): PlanResult {
  const goalKey = String(raw.goalType ?? raw.goal ?? '').toUpperCase();
  const horizonKey = String(raw.horizon ?? raw.investmentHorizon ?? '').toUpperCase();
  const goalType = GOAL_MAP[goalKey] ?? String(raw.goalType ?? raw.goal ?? '').toLowerCase();
  const horizon = HORIZON_MAP[horizonKey] ?? String(raw.horizon ?? raw.investmentHorizon ?? '').toLowerCase();
  const breakdown = raw.allocationBreakdown ?? {};
  const existingAllocations = raw.allocations;
  const backendFunds = raw.recommendedFunds ?? [];
  const funds = existingAllocations?.funds ?? backendFunds.map((fund) => ({
    fundId: fund.fundId,
    fundName: fund.fundName ?? fund.schemeName ?? 'Recommended Fund',
    category: fund.subCategory ?? fund.mainCategory ?? fund.category ?? 'Other',
    percentage: fund.allocationPercentage ?? fund.percentage ?? 0,
    monthlyAmount: Number(fund.monthlyAmount ?? 0),
    schemeCode: fund.schemeCode,
    fundHouse: fund.fundHouse,
  }));
  const explanation = existingAllocations?.explanation ?? (
    Array.isArray(raw.explanation) ? raw.explanation : raw.explanation ? [raw.explanation] : []
  );

  return {
    id: raw.id,
    riskProfile: String(raw.riskProfile ?? 'moderate').toLowerCase(),
    goal: goalType,
    goalType,
    investmentHorizon: horizon,
    horizon,
    monthlyAmount: Number(raw.monthlyAmount ?? raw.monthlyInvestment ?? 0),
    allocations: {
      expectedReturnRate: Number(existingAllocations?.expectedReturnRate ?? breakdown.blendedReturnRate ?? 0),
      estimatedFutureValue: Number(existingAllocations?.estimatedFutureValue ?? raw.projectedValue ?? 0),
      horizonYears: existingAllocations?.horizonYears ?? HORIZON_YEARS[horizon] ?? 0,
      funds,
      explanation,
    },
    totalInvested: Number(raw.totalInvested ?? 0),
    projectedValue: Number(raw.projectedValue ?? existingAllocations?.estimatedFutureValue ?? 0),
    projectedReturns: Number(raw.projectedReturns ?? 0),
    explanation: raw.explanation,
    status: raw.status,
    createdAt: raw.createdAt,
  };
}

function unwrap<T>(body: { data?: { data?: T } | T }): T {
  const nested = body?.data as { data?: T } | T | undefined;
  if (nested && typeof nested === 'object' && 'data' in nested && nested.data !== undefined) {
    return nested.data as T;
  }
  return nested as T;
}

export const plannerApi = {
  generatePlan: async (data: PlannerFormData): Promise<PlanResult> => {
    const response = await api.post('/planner/generate', data);
    
    // Axios already parses JSON. The body is in response.data.
    const body = response.data;
    
    // The NestJS backend has a global interceptor that wraps the response.
    // The controller returns { message, data: plan }
    // The interceptor wraps it in { success: true, data: <CONTROLLER_RESPONSE>, timestamp }
    // Therefore, the plan is at body.data.data
    let plan: PlanResult | undefined;
    
    const rawPlan = unwrap<BackendPlan>(body);
    if (rawPlan) plan = normalizePlan(rawPlan);

    if (!plan?.id || !plan?.allocations) {
      console.error('[plannerApi] Unexpected response shape:', JSON.stringify(body));
      throw new Error('Plan data or allocations are missing. Please try again.');
    }

    return plan;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/planner/stats');
    return response.data.data;
  },

  getUserPlans: async (): Promise<PlanResult[]> => {
    const response = await api.get('/planner/plans');
    const rawPlans = unwrap<BackendPlan[]>(response.data);
    return (rawPlans ?? []).map(normalizePlan);
  },

  deletePlan: async (planId: string): Promise<void> => {
    await api.delete(`/planner/plans/${planId}`);
  },
};



