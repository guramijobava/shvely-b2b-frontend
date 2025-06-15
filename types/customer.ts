export interface CustomerFinancialProfile {
  customerId: string
  customerInfo: {
    fullName: string
    email: string
    phoneNumber: string
  }
  creditScore: {
    score: number
    scoreRange: { min: number; max: number }
    grade: "A" | "B" | "C" | "D" | "F"
    factors: string[]
    lastUpdated: string
    provider: string
    history?: { date: string; score: number }[]
  }
  bankAccounts: BankAccount[]
  financialSummary: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    netCashFlow: number
    accountAge: number
    overdraftCount: number
  }
  transactionAnalysis: {
    totalTransactions: number
    avgMonthlySpending: number
    topCategories: CategorySpending[]
    incomeStreams: IncomeStream[]
    recurringPayments: RecurringPayment[]
  }
  riskIndicators: {
    irregularIncomePattern: boolean
    highOverdraftFrequency: boolean
    gamblingActivity: boolean
    cryptocurrencyActivity: boolean
    largeUnexplainedDeposits: boolean
  }
  lastUpdated: string
  verificationId: string
}

export interface BankAccount {
  accountId: string
  bankName: string
  accountType: "checking" | "savings" | "credit" | "investment"
  accountNumber: string // masked
  routingNumber?: string
  balance: number
  availableBalance?: number
  openedDate: string
  currency: string
  transactions: Transaction[]
  monthlyBalances: { month: string; balance: number }[]
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  date: string
  description: string
  merchantName?: string
  category: string[]
  subcategory?: string
  type: "debit" | "credit"
  status: "pending" | "posted"
  location?: string
  paymentMethod?: string
}

export interface CategorySpending {
  category: string
  amount: number
  percentage: number
  transactionCount: number
  trend: "increasing" | "decreasing" | "stable"
  monthlyData: { month: string; amount: number }[]
}

export interface IncomeStream {
  source: string
  frequency: "weekly" | "bi-weekly" | "monthly" | "irregular"
  averageAmount: number
  lastAmount: number
  confidence: number // 0-100
  category: "salary" | "freelance" | "benefits" | "investment" | "other"
}

export interface RecurringPayment {
  merchant: string
  frequency: "weekly" | "monthly" | "quarterly" | "annual"
  averageAmount: number
  category: string
  nextExpectedDate?: string
}
