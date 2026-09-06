import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('compares products in a single request instead of one call per product', () => {
    service.compare([1, 2, 3]).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products/compare?ids=1,2,3`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('fetches all products and unwraps the paginated response', () => {
    let result: unknown;
    service.getAll().subscribe((products) => (result = products));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products`);
    expect(req.request.method).toBe('GET');
    const product = { id: 1, name: 'Health Basic', category: 'HEALTH' };
    req.flush({ content: [product], totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true });

    expect(result).toEqual([product]);
  });

  it('fetches products with category/term query params and unwraps the page', () => {
    service.getAll({ category: 'HEALTH', term: 'basic' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products?category=HEALTH&term=basic`);
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true });
  });
});
