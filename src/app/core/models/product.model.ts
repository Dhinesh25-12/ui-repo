export type ProductCategory = 'HEALTH' | 'MOTOR' | 'LIFE' | 'TRAVEL';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  coverageAmount: number;
  premiumAmount: number;
  tenureMonths: number;
  description?: string;
  active?: boolean;
}

export interface ProductRequest {
  name: string;
  category: ProductCategory;
  coverageAmount: number;
  premiumAmount: number;
  tenureMonths: number;
  description?: string;
}
