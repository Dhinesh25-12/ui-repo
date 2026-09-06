export type DashboardActivityType = 'PAYMENT' | 'CLAIM' | 'POLICY' | 'RENEWAL' | 'CANCELLATION' | string;

export interface DashboardActivity {
  id?: number;
  type?: DashboardActivityType;
  title?: string;
  /** Legacy/fallback text used when the backend does not send a title. */
  message?: string;
  description?: string;
  amount?: number;
  referenceNumber?: string;
  timestamp: string;
}

export interface DashboardSummary {
  totalPolicies: number;
  activePolicies: number;
  claimsFiled: number;
  totalPayments: number;
  policySplit: { category: string; count: number }[];
  revenueTrend: { month: string; revenue: number }[];
  recentActivity: DashboardActivity[];
}
