export interface CustomerReportSummary {
  activePolicies: number;
  expiredPolicies: number;
  claimsSubmitted: number;
}

export interface PremiumCollectionReport {
  period: string;
  totalCollected: number;
}

export interface ClaimsRatioReport {
  period: string;
  claimsFiled: number;
  claimsSettled: number;
  settlementRatio: number;
}

export interface ProductPerformanceReport {
  productId: number;
  productName: string;
  policiesSold: number;
  totalPremium: number;
  totalClaims: number;
  profitability: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

export interface TopCustomerReport {
  customerId: number;
  customerName: string;
  totalPremiumPaid: number;
}
