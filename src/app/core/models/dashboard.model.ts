export interface DashboardSummary {
  totalPolicies: number;
  activePolicies: number;
  claimsFiled: number;
  totalPayments: number;
  policySplit: { category: string; count: number }[];
  revenueTrend: { month: string; revenue: number }[];
  recentActivity: { message: string; timestamp: string }[];
}
