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
});
