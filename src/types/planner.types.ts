// Planner form types — mirrors backend enums exactly

export type InvestmentGoal =
  | 'wealth_creation'
  | 'retirement'
  | 'house_purchase'
  | 'child_education'
  | 'emergency_fund'
  | 'tax_saving';

export type InvestmentHorizon =
  | 'less_than_3_years'
  | '3_to_5_years'
  | '5_to_10_years'
  | 'more_than_10_years';

export type MarketFallReaction = 'sell' | 'wait' | 'buy_more';
export type InvestmentMode = 'sip' | 'lump_sum' | 'both';
export type InvestmentExperience = 'none' | 'less_than_2_years' | 'more_than_2_years';
export type EmergencyFundStatus = 'no_fund' | '3_to_6_months' | 'more_than_6_months';

export interface PlannerFormData {
  age: number | '';
  monthlyIncome: number | '';
  monthlyInvestment: number | '';
  goal: InvestmentGoal | '';
  horizon: InvestmentHorizon | '';
  marketFallReaction: MarketFallReaction | '';
  investmentExperience: InvestmentExperience | '';
  emergencyFund: EmergencyFundStatus | '';
  investmentMode: InvestmentMode | '';
}

export interface FundAllocationItem {
  fundId: string;
  fundName: string;
  category: string;
  percentage: number;
  monthlyAmount: number;
}

export interface PlanResult {
  id: string;
  riskProfile: string;
  goalType: string;
  horizon: string;
  monthlyAmount: number;
  allocations: {
    expectedReturnRate: number;
    estimatedFutureValue: number;
    horizonYears: number;
    funds: FundAllocationItem[];
    explanation: string[];
  };
  createdAt: string;
}

export interface RiskAllocationItem {
  name: string;
  value: number;
}

export interface DashboardStats {
  totalPlans: number;
  totalMonthlyInvestment: number;
  riskAllocation: RiskAllocationItem[];
}

