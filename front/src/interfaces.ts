export interface Product {
  code: string;
  product_name: string;
  image_url?: string;
  brands?: string;
  categories?: string[];
  nova_group?: number;
  nutrition_grade_fr?: string;
  eco_score?: string;
  ingredients_text?: string;
  quantity?: string;
}

export interface SearchFilters {
  q?: string;
  brand?: string;
  category?: string;
  nutriscore?: string;
  minKcal?: string;
  maxKcal?: string;
  page?: string;
  pageSize?: string;
}

export interface ProductSearchResponse {
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
