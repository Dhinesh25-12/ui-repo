export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING_CANCELLATION';

export interface Policy {
  id: number;
  policyNumber: string;
  productId: number;
  productName?: string;
  customerId: number;
  customerName?: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  coverageAmount: number;
  status: PolicyStatus;
  nomineeName?: string;
  nomineeRelationship?: string;
  nomineeContact?: string;
  cancellationRequested?: boolean;
}

export interface PurchasePolicyRequest {
  productId: number;
  nomineeName: string;
  nomineeRelationship?: string;
  nomineeContact?: string;
}

export interface RenewalQuote {
  policyId: number;
  renewalPremium: number;
  newEndDate: string;
}

export interface CancellationRequestPayload {
  reason: string;
}
