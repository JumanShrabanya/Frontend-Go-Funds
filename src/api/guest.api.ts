import api from './axios.instance';
import { PlanResult } from '../types/planner.types';

export const guestPlannerApi = {
  generatePlan: async (data: {
    monthlyInvestment: number;
    goal: string;
    investmentHorizon: string;
    riskProfile?: string;
  }): Promise<PlanResult> => {
    try {
      const response = await api.post('/guest/planner/generate', data);
      const body = response.data;

    let plan: PlanResult | undefined;

    if (body?.data?.data) {
      plan = body.data.data;
    } else if (body?.data?.allocations) {
      plan = body.data;
    } else if (body?.allocations) {
      plan = body;
    } else if (body?.data?.recommendedFunds) {
      plan = body.data;
    }

    if (!plan) {
      console.error('[guestPlannerApi] Unexpected response shape:', JSON.stringify(body));
      throw new Error('Plan data is missing. Please try again.');
    }

    // Normalize backend response to frontend shape
    if (plan.recommendedFunds && !plan.allocations) {
      const funds = plan.recommendedFunds.map((f: any) => ({
        fundId: f.fundId,
        fundName: f.schemeName || f.fundName,
        category: f.subCategory || f.mainCategory || f.category,
        percentage: f.allocationPercentage || f.percentage,
        monthlyAmount: f.monthlyAmount,
        schemeCode: f.schemeCode,
        fundHouse: f.fundHouse,
      }));
      const breakdown = plan.allocationBreakdown || {};
      const horizonYears =
        plan.investmentHorizon === 'LESS_THAN_3_YEARS'
          ? 2
          : plan.investmentHorizon === 'THREE_TO_FIVE_YEARS'
          ? 4
          : plan.investmentHorizon === 'FIVE_TO_TEN_YEARS'
          ? 7
          : plan.investmentHorizon === 'MORE_THAN_10_YEARS'
          ? 15
          : 7;
      const explanation = Array.isArray(plan.explanation)
        ? plan.explanation
        : plan.explanation
        ? [plan.explanation]
        : [];
      plan.allocations = {
        expectedReturnRate: breakdown.blendedReturnRate || 10,
        estimatedFutureValue: plan.projectedValue || plan.totalInvested || 0,
        horizonYears,
        funds,
        explanation,
      };
      plan.goalType = plan.goal || plan.goalType;
      plan.horizon = plan.investmentHorizon || plan.horizon;
      plan.monthlyAmount = plan.monthlyAmount || plan.monthlyInvestment || 0;
    }

    if (!plan?.allocations?.funds) {
      console.error('[guestPlannerApi] Unexpected response shape:', JSON.stringify(body));
      throw new Error('Plan allocations are missing. Please try again.');
    }

    return plan;
    } catch (err: any) {
      console.error('[guestPlannerApi] Error:', err);
      throw err;
    }
  },
};
