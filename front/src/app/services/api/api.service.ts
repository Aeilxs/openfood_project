// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product, SearchFilters } from '@src/interfaces';
import { LoggerService } from '@services/logger/logger.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly url = 'http://localhost:3000'; // proxy.conf.json

    constructor(private http: HttpClient, private logger: LoggerService) {
        this.logger.debug('ApiService initialized');
    }

    /**
     * @param filters An object containing the search filters.
     * @returns An Observable that emits an object with a "products" property,
     *          which is an array of Product objects.
     */
    searchProducts(filters: SearchFilters): Observable<{ products: Product[] }> {
        const url = this.url;
        const params = this.buildHttpParams(filters);

        this.logger.debug('Calling searchProducts with filters:', filters);
        this.logger.debug('HTTP Params:', params.toString());
        this.logger.debug('Final URL:', `${url}?${params.toString()}`);

        return this.http.get<{ products: any[] }>(url, { params }).pipe(
            map((response: any) => {
                this.logger.debug('Raw API response:', response);
                const transformedProducts = response.products.map((raw: any) => {
                    const product = this.transformProduct(raw);
                    this.logger.debug('Transformed product:', product);
                    return product;
                });
                return { products: transformedProducts };
            }),
            catchError((error) => {
                this.logger.error('Error fetching products:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * @param filters The search filters to convert.
     * @returns HttpParams object with all defined filters.
     */
    private buildHttpParams(filters: SearchFilters): HttpParams {
        let params = new HttpParams();

        params = params.set('json', 'true');

        for (const [k, v] of Object.entries(filters)) {
            if (v === undefined || v === null) continue;

            if (k === 'search_terms') {
                params = params.set('search_terms', v.toString());
                continue;
            }

            if (Array.isArray(v) && v.length > 0) {
                params = params.set(k, v.join(','));
            } else if (!Array.isArray(v)) {
                params = params.set(k, v.toString());
            }
        }

        this.logger.debug('Built HttpParams:', params.toString());
        return params;
    }

    /**
     * Transforms a raw product object from the API into Product interface.
     * @param raw The raw product object from the API.
     * @returns A Product object.
     */
    private transformProduct(raw: any): Product {
        this.logger.trace('Transforming raw product:', raw);
        const product: Product = {
            code: raw.code,
            product_name: raw.product_name || raw.product_name_en || raw.product_name_fr || '',
            brands:
                raw.brands ||
                (Array.isArray(raw.brands_tags) ? raw.brands_tags.join(', ') : undefined),
            categories: raw.categories,
            image_url: raw.image_url || raw.selected_images?.front?.display?.en || '',
            nutriments: raw.nutriments
                ? {
                      energy_kcal: raw.nutriments['energy-kcal']
                          ? Number(raw.nutriments['energy-kcal'])
                          : undefined,
                      fat: raw.nutriments.fat ? Number(raw.nutriments.fat) : undefined,
                      saturated_fat: raw.nutriments['saturated-fat']
                          ? Number(raw.nutriments['saturated-fat'])
                          : undefined,
                      carbohydrates: raw.nutriments.carbohydrates
                          ? Number(raw.nutriments.carbohydrates)
                          : undefined,
                      sugars: raw.nutriments.sugars ? Number(raw.nutriments.sugars) : undefined,
                      fiber: raw.nutriments.fiber ? Number(raw.nutriments.fiber) : undefined,
                      proteins: raw.nutriments.proteins
                          ? Number(raw.nutriments.proteins)
                          : undefined,
                      sodium: raw.nutriments.salt ? Number(raw.nutriments.salt) : undefined,
                  }
                : undefined,
            nutriscore_grade: raw.nutriscore_grade,
            ingredients_text: raw.ingredients_text,
            labels: raw.labels,
            packaging: raw.packaging,
        };
        this.logger.trace('Transformed product:', product);
        return product;
    }
}
