export interface Product {
    code: string;

    product_name: string;
    brands?: string;
    categories?: string;
    image_url?: string;

    nutriments?: {
        energy_kcal?: number;
        fat?: number;
        saturated_fat?: number;
        carbohydrates?: number;
        sugars?: number;
        fiber?: number;
        proteins?: number;
        sodium?: number;
    };

    nutriscore_grade?: string;
    ingredients_text?: string;
    labels?: string;
    packaging?: string;
}

export interface SearchFilters {
    search_terms: string;
    brands?: string[];
    categories?: string[];
    labels?: string[];
    countries?: string[];
    nutriments?: string[];
    page?: number;
    page_size?: number;
}

export enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    OFF = 5,
}
