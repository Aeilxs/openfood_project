import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, SearchFilters } from '@src/interfaces';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private _products = new BehaviorSubject<Product[]>([]);
    public readonly products$ = this._products.asObservable();

    constructor(private api: ApiService) {}

    search(filters: SearchFilters): void {
        this.api.searchProducts(filters).subscribe({
            next: (res) => this._products.next(res.products),
            error: () => this._products.next([]),
        });
    }

    clear(): void {
        this._products.next([]);
    }
}
