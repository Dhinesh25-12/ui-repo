export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING_CANCELLATION';

export interface NomineeDetails {
  name: string;
  relationship: string;
  dateOfBirth: string;
  contactNumber?: string;
}

export interface Policy {
  id: number;
  policyNumber: string;
  productId: number;
  productName?: string;
  customerId: number;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  coverageAmount: number;
  status: PolicyStatus;
  nominee: NomineeDetails;
}

export interface PurchasePolicyRequest {
  productId: number;
  nominee: NomineeDetails;
}

export interface RenewalQuote {
  policyId: number;
  renewalPremium: number;
  newEndDate: string;
}

export interface CancellationRequestPayload {
  reason: string;
}
