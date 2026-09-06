export type ClaimStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SETTLED';

export interface ClaimDocumentMeta {
  fileName: string;
  fileType?: string;
  fileSize?: number;
}

export interface Claim {
  id: number;
  claimNumber: string;
  policyId: number;
  policyNumber?: string;
  incidentDate: string;
  description: string;
  status: ClaimStatus;
  documents?: ClaimDocumentMeta[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FileClaimRequest {
  policyId: number;
  incidentDate: string;
  description: string;
}

export type ClaimDecisionAction = 'APPROVED' | 'REJECTED';

export interface ClaimDecisionRequest {
  decision: ClaimDecisionAction;
  remarks?: string;
}

export interface ClaimStatusUpdateRequest {
  status: ClaimStatus;
  remarks?: string;
}
