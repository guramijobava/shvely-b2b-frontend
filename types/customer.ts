export interface CustomerFinancialProfile {
  customerId: string
  customerInfo: {
    fullName: string
    email: string
    phoneNumber: string
    dateOfBirth?: string          // Date of birth, null = need to collect
    nationality?: string           // "Georgian", null = need to collect
    identificationNumber?: string  // Georgian ID, null = need to collect  
    residingCountry?: string      // "United States", null = need to collect
    street?: string               // Street address, null = need to collect
    zipcode?: string              // Zipcode/postal code, null = need to collect
    socialSecurityNumber?: string // US SSN, null = need to collect
    state?: string                // US State, null = need to collect
    city?: string                 // US City, null = need to collect
  }
  creditReports: {
    equifax: CreditBureauReport
    experian: CreditBureauReport
    transunion: CreditBureauReport
    summary: CreditSummary
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

export interface CreditBureauReport {
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  lastUpdated: string
  utilization: {
    totalCredit: number
    usedCredit: number
    utilizationPercentage: number
  }
  paymentHistory: {
    onTimePercentage: number
    recentLatePayments: number
  }
  creditScoreFactors?: {
    paymentHistory: {
      score: number
      rating: "POOR" | "FAIR" | "GOOD" | "VERY GOOD" | "EXCEPTIONAL"
      impact: "high" | "medium" | "low"
    }
    amountOfDebt: {
      score: number
      rating: "POOR" | "FAIR" | "GOOD" | "VERY GOOD" | "EXCEPTIONAL"
      impact: "high" | "medium" | "low"
    }
    lengthOfCreditHistory: {
      score: number
      rating: "POOR" | "FAIR" | "GOOD" | "VERY GOOD" | "EXCEPTIONAL"
      impact: "high" | "medium" | "low"
      averageAccountAge: number // in years
    }
    amountOfNewCredit: {
      score: number
      rating: "POOR" | "FAIR" | "GOOD" | "VERY GOOD" | "EXCEPTIONAL"
      impact: "high" | "medium" | "low"
      recentInquiries: number
    }
    creditMix: {
      score: number
      rating: "POOR" | "FAIR" | "GOOD" | "VERY GOOD" | "EXCEPTIONAL"
      impact: "high" | "medium" | "low"
      accountTypes: string[]
    }
  }
  creditHistory?: {
    month: string
    score: number
  }[]
}

export interface CreditSummary {
  averageScore: number
  scoreVariance: number
  overallGrade: "A" | "B" | "C" | "D" | "F"
  riskLevel: "low" | "medium" | "high"
  primaryBureau: "equifax" | "experian" | "transunion"
  majorDiscrepancies: string[]
}
