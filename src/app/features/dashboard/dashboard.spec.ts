import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Dashboard } from './dashboard';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummary } from '../../core/models/dashboard.model';

/** Matches the product-category `policySplit` shape returned by the backend. */
function summaryWith(policySplit: { category: string; count: number }[]): DashboardSummary {
  const total = policySplit.reduce((sum, item) => sum + item.count, 0);
  return {
    totalPolicies: total,
    activePolicies: total,
    claimsFiled: 1,
    totalPayments: 1000,
    policySplit,
    revenueTrend: [],
    recentActivity: []
  };
}

/** Sample product-category split matching the approved dashboard mockup. */
const MOCKUP_SPLIT = [
  { category: 'Health Insurance', count: 2 },
  { category: 'Motor Insurance', count: 1 },
  { category: 'Life Insurance', count: 1 },
  { category: 'Travel Insurance', count: 0 }
];

describe('Dashboard', () => {
  let dashboardServiceStub: { getSummary: ReturnType<typeof vi.fn> };
  let authServiceStub: { hasRole: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dashboardServiceStub = { getSummary: vi.fn().mockReturnValue(of(summaryWith([]))) };
    authServiceStub = { hasRole: vi.fn().mockReturnValue(true) };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: DashboardService, useValue: dashboardServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();
  });

  function renderWith(policySplit: { category: string; count: number }[]): HTMLElement {
    dashboardServiceStub.getSummary.mockReturnValue(of(summaryWith(policySplit)));
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a legend entry per product category with the center total', () => {
    const element = renderWith(MOCKUP_SPLIT);

    const legendItems = Array.from(element.querySelectorAll('.legend li'));
    expect(legendItems.map((li) => li.textContent?.trim().replace(/\s+/g, ' '))).toEqual([
      'Health Insurance 2',
      'Motor Insurance 1',
      'Life Insurance 1',
      'Travel Insurance 0'
    ]);
    expect(element.querySelector('.donut-total')?.textContent?.trim()).toBe('4');
    expect(element.querySelector('.donut-card h2')?.textContent?.trim()).toBe('Policy Overview by Product');
  });

  it('assigns distinct swatch colors while categories fit within the palette', () => {
    const element = renderWith(MOCKUP_SPLIT);

    const colors = Array.from(element.querySelectorAll<HTMLElement>('.legend .swatch')).map(
      (swatch) => swatch.style.background
    );
    expect(colors).toHaveLength(4);
    expect(new Set(colors).size).toBe(4);
  });

  it('handles a variable number of categories', () => {
    const single = renderWith([{ category: 'Health Insurance', count: 3 }]);
    expect(single.querySelectorAll('.legend li')).toHaveLength(1);
    expect(single.querySelector('.donut-total')?.textContent?.trim()).toBe('3');

    const many = renderWith(
      Array.from({ length: 8 }, (_, i) => ({ category: `Product ${i}`, count: 1 }))
    );
    expect(many.querySelectorAll('.legend li')).toHaveLength(8);
    expect(many.querySelector('.donut-total')?.textContent?.trim()).toBe('8');
  });

  it('shows an empty state when no categories are returned', () => {
    const element = renderWith([]);
    expect(element.querySelector('.legend')).toBeNull();
    expect(element.querySelector('.donut-card app-empty-state')).not.toBeNull();
  });

  describe('permission handling', () => {
    it('short-circuits to the forbidden state without calling the API for a non-Admin user', () => {
      authServiceStub.hasRole.mockReturnValue(false);

      const fixture = TestBed.createComponent(Dashboard);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;

      expect(dashboardServiceStub.getSummary).not.toHaveBeenCalled();
      expect(fixture.componentInstance.forbidden()).toBe(true);
      expect(fixture.componentInstance.errored()).toBe(false);
      expect(element.querySelector('.empty-title')?.textContent?.trim()).toBe('Dashboard access restricted');
      expect(element.querySelector('.retry-btn')).toBeNull();
    });

    it('sets forbidden (not errored) when the API responds with a 403', () => {
      dashboardServiceStub.getSummary.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 403 }))
      );

      const fixture = TestBed.createComponent(Dashboard);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;

      expect(fixture.componentInstance.forbidden()).toBe(true);
      expect(fixture.componentInstance.errored()).toBe(false);
      expect(element.querySelector('.empty-title')?.textContent?.trim()).toBe('Dashboard access restricted');
      expect(element.querySelector('.retry-btn')).toBeNull();
    });

    it('sets errored (with Retry available) for a non-403 failure', () => {
      dashboardServiceStub.getSummary.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 }))
      );

      const fixture = TestBed.createComponent(Dashboard);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;

      expect(fixture.componentInstance.errored()).toBe(true);
      expect(fixture.componentInstance.forbidden()).toBe(false);
      expect(element.querySelector('.empty-title')?.textContent?.trim()).toBe('Unable to load dashboard data');
      expect(element.querySelector('.retry-btn')).not.toBeNull();
    });
  });
});
