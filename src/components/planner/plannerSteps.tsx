import {
  InvestmentGoal,
  InvestmentHorizon,
  MarketFallReaction,
  InvestmentMode,
  InvestmentExperience,
  EmergencyFundStatus,
} from '@/src/types/planner.types';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimerIcon from '@mui/icons-material/Timer';
import EventIcon from '@mui/icons-material/Event';
import SpaIcon from '@mui/icons-material/Spa';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PaymentsIcon from '@mui/icons-material/Payments';
import BalanceIcon from '@mui/icons-material/Balance';

export type FieldKey =
  | 'age'
  | 'monthlyIncome'
  | 'monthlyInvestment'
  | 'goal'
  | 'horizon'
  | 'marketFallReaction'
  | 'investmentExperience'
  | 'emergencyFund'
  | 'investmentMode';

export type QuestionType = 'number' | 'choice';

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface QuestionStep {
  field: FieldKey;
  type: QuestionType;
  question: string;
  tagline: string;        // short 2-liner context for user
  helpText?: string;      // secondary hint (e.g., "₹ per month")
  options?: ChoiceOption[];
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  validate: (value: string | number) => string | null; // null = valid
}

export const PLANNER_STEPS: QuestionStep[] = [
  {
    field: 'age',
    type: 'number',
    question: 'How old are you?',
    tagline: 'Your age helps us understand your investment horizon and risk capacity. Younger investors can typically absorb more short-term volatility.',
    helpText: 'Must be between 18 and 80',
    min: 18,
    max: 80,
    suffix: 'years',
    validate: (v) => {
      const n = Number(v);
      if (!v || v === '') return 'Please enter your age.';
      if (n < 18) return 'You must be at least 18 years old.';
      if (n > 80) return 'Please enter a valid age.';
      return null;
    },
  },
  {
    field: 'monthlyIncome',
    type: 'number',
    question: 'What is your monthly income?',
    tagline: 'This helps us gauge how much you can comfortably invest without straining your finances. We keep all financial data private and secure.',
    helpText: 'After-tax monthly take-home pay',
    min: 1000,
    max: 10000000, // 1 Crore limit
    prefix: '₹',
    validate: (v) => {
      const n = Number(v);
      if (!v || v === '') return 'Please enter your monthly income.';
      if (n < 1000) return 'Monthly income must be at least ₹1,000.';
      if (n > 10000000) return 'Please enter a realistic monthly income (max ₹1,00,00,000).';
      return null;
    },
  },
  {
    field: 'monthlyInvestment',
    type: 'number',
    question: 'How much do you want to invest each month?',
    tagline: 'Even small, consistent amounts compound into significant wealth over time. Start with what you are comfortable with — you can always increase later.',
    helpText: 'Minimum ₹500 per month',
    min: 500,
    max: 10000000, // 1 Crore limit
    prefix: '₹',
    validate: (v) => {
      const n = Number(v);
      if (!v || v === '') return 'Please enter a monthly investment amount.';
      if (n < 500) return 'Minimum investment is ₹500 per month.';
      if (n > 10000000) return 'Please enter a realistic investment amount (max ₹1,00,00,000).';
      return null;
    },
  },
  {
    field: 'goal',
    type: 'choice',
    question: 'What is your primary investment goal?',
    tagline: 'Different goals require different strategies. Selecting the right goal ensures your portfolio is optimized for what matters most to you.',
    options: [
      { value: 'wealth_creation' as InvestmentGoal, label: 'Wealth Creation', icon: <TrendingUpIcon fontSize="large" />, description: 'Grow my money significantly over the long term' },
      { value: 'retirement' as InvestmentGoal, label: 'Retirement', icon: <BeachAccessIcon fontSize="large" />, description: 'Build a secure retirement corpus for the future' },
      { value: 'house_purchase' as InvestmentGoal, label: 'House Purchase', icon: <HomeIcon fontSize="large" />, description: 'Save for a down payment or full home purchase' },
      { value: 'child_education' as InvestmentGoal, label: 'Child Education', icon: <SchoolIcon fontSize="large" />, description: 'Fund quality education for my children' },
      { value: 'emergency_fund' as InvestmentGoal, label: 'Emergency Fund', icon: <SecurityIcon fontSize="large" />, description: 'Build a liquid safety net for unexpected expenses' },
      { value: 'tax_saving' as InvestmentGoal, label: 'Tax Saving', icon: <AccountBalanceIcon fontSize="large" />, description: 'Save taxes under Section 80C with ELSS funds' },
    ],
    validate: (v) => (!v ? 'Please select your investment goal.' : null),
  },
  {
    field: 'horizon',
    type: 'choice',
    question: 'How long do you plan to stay invested?',
    tagline: 'A longer horizon allows your investments to ride out market fluctuations and unlock the power of compounding. This is arguably the most important input.',
    options: [
      { value: 'less_than_3_years' as InvestmentHorizon, label: 'Under 3 Years', icon: <TimerIcon fontSize="large" />, description: 'Short-term needs, focused on capital safety' },
      { value: '3_to_5_years' as InvestmentHorizon, label: '3 to 5 Years', icon: <EventIcon fontSize="large" />, description: 'Medium-term with balanced growth approach' },
      { value: '5_to_10_years' as InvestmentHorizon, label: '5 to 10 Years', icon: <SpaIcon fontSize="large" />, description: 'Long-term with solid equity participation' },
      { value: 'more_than_10_years' as InvestmentHorizon, label: 'Over 10 Years', icon: <RocketLaunchIcon fontSize="large" />, description: 'Aggressive long-term wealth compounding' },
    ],
    validate: (v) => (!v ? 'Please select your investment horizon.' : null),
  },
  {
    field: 'marketFallReaction',
    type: 'choice',
    question: 'Imagine the market drops 20% in a month. What do you do?',
    tagline: 'This reveals your emotional tolerance for risk. There are no right or wrong answers — honest responses lead to a better-matched portfolio for you.',
    options: [
      { value: 'sell' as MarketFallReaction, label: 'Sell and Exit', icon: <ExitToAppIcon fontSize="large" />, description: 'I prefer to cut my losses and protect my capital' },
      { value: 'wait' as MarketFallReaction, label: 'Hold and Wait', icon: <HourglassEmptyIcon fontSize="large" />, description: 'I stay put and wait for the market to recover' },
      { value: 'buy_more' as MarketFallReaction, label: 'Buy More', icon: <ShoppingCartIcon fontSize="large" />, description: 'I see it as an opportunity to invest at lower prices' },
    ],
    validate: (v) => (!v ? 'Please select your reaction.' : null),
  },
  {
    field: 'investmentExperience',
    type: 'choice',
    question: 'How much experience do you have with investments?',
    tagline: 'Experience indicates familiarity with market cycles. This helps us calibrate how much explanation and guidance to include with your plan.',
    options: [
      { value: 'none' as InvestmentExperience, label: 'No Experience', icon: <StarBorderIcon fontSize="large" />, description: 'I am new to investing — this is my first time' },
      { value: 'less_than_2_years' as InvestmentExperience, label: 'Under 2 Years', icon: <MenuBookIcon fontSize="large" />, description: 'I have invested for a short period before' },
      { value: 'more_than_2_years' as InvestmentExperience, label: '2+ Years', icon: <WorkOutlinedIcon fontSize="large" />, description: 'I understand market cycles and investment basics' },
    ],
    validate: (v) => (!v ? 'Please select your experience level.' : null),
  },
  {
    field: 'emergencyFund',
    type: 'choice',
    question: 'Do you have an emergency fund set aside?',
    tagline: 'An emergency fund ensures you will not need to liquidate your investments during a personal financial crisis. It is the foundation of sound financial planning.',
    options: [
      { value: 'no_fund' as EmergencyFundStatus, label: 'No Emergency Fund', icon: <WarningAmberIcon fontSize="large" />, description: 'I do not have separate savings for emergencies' },
      { value: '3_to_6_months' as EmergencyFundStatus, label: '3 to 6 Months of Expenses', icon: <CheckCircleOutlinedIcon fontSize="large" />, description: 'I have some safety net but it is not fully built' },
      { value: 'more_than_6_months' as EmergencyFundStatus, label: '6+ Months of Expenses', icon: <AccountBalanceWalletIcon fontSize="large" />, description: 'I have a strong, comfortable financial cushion' },
    ],
    validate: (v) => (!v ? 'Please select your emergency fund status.' : null),
  },
  {
    field: 'investmentMode',
    type: 'choice',
    question: 'How would you like to invest?',
    tagline: 'SIP is a disciplined monthly approach that averages out market timing. Lump Sum is ideal if you have a large amount ready. Both combines the two strategies.',
    options: [
      { value: 'sip' as InvestmentMode, label: 'SIP (Monthly)', icon: <AutorenewIcon fontSize="large" />, description: 'Invest a fixed amount automatically every month' },
      { value: 'lump_sum' as InvestmentMode, label: 'Lump Sum', icon: <PaymentsIcon fontSize="large" />, description: 'Invest a large one-time amount immediately' },
      { value: 'both' as InvestmentMode, label: 'Both', icon: <BalanceIcon fontSize="large" />, description: 'Split between SIP and a one-time investment' },
    ],
    validate: (v) => (!v ? 'Please select your investment mode.' : null),
  },
];
