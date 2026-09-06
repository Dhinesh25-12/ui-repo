import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PolicyPurchase } from './policy-purchase';
import { PolicyService } from '../../../core/services/policy.service';
import { ProductService } from '../../../core/services/product.service';

describe('PolicyPurchase', () => {
  let policyServiceStub: { purchase: ReturnType<typeof vi.fn> };
  let productServiceStub: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    policyServiceStub = {
      purchase: vi.fn().mockReturnValue(of({ id: 1, policyNumber: 'POL-1' }))
    };
    productServiceStub = {
      getAll: vi.fn().mockReturnValue(of([{ id: 5, name: 'Term Life' }]))
    };

    await TestBed.configureTestingModule({
      imports: [PolicyPurchase],
      providers: [
        { provide: PolicyService, useValue: policyServiceStub },
        { provide: ProductService, useValue: productServiceStub },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } }
      ]
    }).compileComponents();
  });

  function createComponent(): PolicyPurchase {
    const fixture = TestBed.createComponent(PolicyPurchase);
    fixture.componentInstance.ngOnInit();
    return fixture.componentInstance;
  }

  it('does not submit an invalid form', () => {
    const component = createComponent();
    component.submit();
    expect(policyServiceStub.purchase).not.toHaveBeenCalled();
  });

  it('flattens the grouped nominee form into the flat backend request shape', () => {
    const component = createComponent();
    component.form.setValue({
      productId: 5,
      nominee: { name: ' Jane Doe ', relationship: 'Spouse', contactNumber: '9876543210' }
    });
    component.submit();

    expect(policyServiceStub.purchase).toHaveBeenCalledWith({
      productId: 5,
      nomineeName: 'Jane Doe',
      nomineeRelationship: 'Spouse',
      nomineeContact: '9876543210'
    });
    expect(component.confirmedPolicy()?.policyNumber).toBe('POL-1');
    expect(component.submitting()).toBe(false);
  });
});
