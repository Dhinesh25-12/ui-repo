import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ClaimsHistory } from '../claims-history/claims-history';
import { ClaimsQueue } from '../claims-queue/claims-queue';

@Component({
  selector: 'app-claims-home',
  standalone: true,
  imports: [CommonModule, ClaimsHistory, ClaimsQueue],
  template: `
    <app-claims-queue *ngIf="auth.hasAnyRole(['CLAIMS_OFFICER', 'ADMIN']); else customerView"></app-claims-queue>
    <ng-template #customerView>
      <app-claims-history></app-claims-history>
    </ng-template>
  `
})
export class ClaimsHome {
  constructor(readonly auth: AuthService) {}
}
