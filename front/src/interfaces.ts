export interface Product {
  code: string;
  product_name: string;
  image_url?: string;
  brands?: string;
  categories?: string;
  nova_group?: number;
  nutrition_grade_fr?: string;
  eco_score?: string;
  ingredients_text?: string;
  quantity?: string;
  labels?: string;
  packaging?: string;
  energy_kcal?: number;
  fat?: number;
  saturated_fat?: number;
  carbohydrates?: number;
  sugars?: number;
  fiber?: number;
  proteins?: number;
  sodium?: number;
}

export interface ProductSearchCriteria {
  q?: string;
  brand?: string;
  category?: string;
  nutriscore?: 'a' | 'b' | 'c' | 'd' | 'e';
  minKcal?: number;
  maxKcal?: number;
  page?: number;
  pageSize?: number;
}

export interface ProductSearchResult {
  total: number;
  page: number;
  pageSize: number;
  data: Product[];
}

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  OFF = 5,
}
