export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Payment {
  id: number;
  policyId: number;
  policyNumber?: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  invoiceNumber?: string;
  receiptUrl?: string;
}

export interface PremiumPaymentRequest {
  policyId: number;
  amount: number;
  paymentMethod: string;
}
