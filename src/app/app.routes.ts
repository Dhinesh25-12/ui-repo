import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list').then((m) => m.ProductList)
      },
      {
        path: 'products/compare',
        loadComponent: () =>
          import('./features/products/product-compare/product-compare').then((m) => m.ProductCompare)
      },
      {
        path: 'products/admin/:id',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/products/product-admin/product-admin').then((m) => m.ProductAdmin)
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/products/product-detail/product-detail').then((m) => m.ProductDetail)
      },
      {
        path: 'policies',
        canActivate: [roleGuard(['CUSTOMER', 'AGENT', 'ADMIN'])],
        loadComponent: () => import('./features/policies/policy-list/policy-list').then((m) => m.PolicyList)
      },
      {
        path: 'policies/purchase',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadComponent: () =>
          import('./features/policies/policy-purchase/policy-purchase').then((m) => m.PolicyPurchase)
      },
      {
        path: 'policies/cancellations',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./features/policies/policy-cancellations/policy-cancellations').then((m) => m.PolicyCancellations)
      },
      {
        path: 'policies/:id',
        canActivate: [roleGuard(['CUSTOMER', 'AGENT', 'ADMIN'])],
        loadComponent: () =>
          import('./features/policies/policy-detail/policy-detail').then((m) => m.PolicyDetail)
      },
      {
        path: 'claims',
        canActivate: [roleGuard(['CUSTOMER', 'CLAIMS_OFFICER', 'ADMIN'])],
        loadComponent: () => import('./features/claims/claims-home/claims-home').then((m) => m.ClaimsHome)
      },
      {
        path: 'claims/new',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadComponent: () => import('./features/claims/claim-file/claim-file').then((m) => m.ClaimFile)
      },
      {
        path: 'payments',
        canActivate: [roleGuard(['CUSTOMER', 'ADMIN'])],
        loadComponent: () =>
          import('./features/payments/payment-history/payment-history').then((m) => m.PaymentHistory)
      },
      {
        path: 'payments/pay',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadComponent: () => import('./features/payments/payment-form/payment-form').then((m) => m.PaymentForm)
      },
      {
        path: 'reports',
        canActivate: [roleGuard(['CUSTOMER', 'ADMIN'])],
        loadComponent: () =>
          import('./features/reports/customer-reports/customer-reports').then((m) => m.CustomerReports)
      },
      {
        path: 'reports/admin',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/reports/admin-reports/admin-reports').then((m) => m.AdminReports)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile)
      },
      {
        path: 'messages',
        data: { title: 'Messages' },
        loadComponent: () => import('./shared/pages/coming-soon/coming-soon').then((m) => m.ComingSoon)
      },
      {
        path: 'support',
        data: { title: 'Support' },
        loadComponent: () => import('./shared/pages/coming-soon/coming-soon').then((m) => m.ComingSoon)
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./features/admin/user-management/user-management').then((m) => m.UserManagement)
      },
      {
        path: 'forbidden',
        loadComponent: () => import('./shared/pages/forbidden/forbidden').then((m) => m.Forbidden)
      }
    ]
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./shared/pages/forbidden/forbidden').then((m) => m.Forbidden)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/pages/not-found/not-found').then((m) => m.NotFound)
  }
];
