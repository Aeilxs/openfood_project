import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  Product,
  ProductSearchCriteria,
  ProductSearchResult,
} from '@src/interfaces';
import { LoggerService } from '@src/services/logger.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000/products';

  /* ---------- state streams ---------- */
  private readonly _products$ = new BehaviorSubject<Product[]>([]);
  readonly products$ = this._products$.asObservable();

  private readonly _total$ = new BehaviorSubject<number>(0);
  readonly totalProducts$ = this._total$.asObservable();

  private readonly _page$ = new BehaviorSubject<number>(0);
  readonly page$ = this._page$.asObservable();

  private readonly _pageSize$ = new BehaviorSubject<number>(9);
  readonly pageSize$ = this._pageSize$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  /** flux public : true ⇒ requête en cours */
  readonly loader$ = this._loading$.asObservable();

  /* ---------- comparison stream ---------- */
  private readonly _comparisonList$ = new BehaviorSubject<Product[]>([]);
  readonly comparisonList$ = this._comparisonList$.asObservable();

  private _lastCriteria: ProductSearchCriteria = {};

  constructor(
    private readonly http: HttpClient,
    private readonly logger: LoggerService
  ) {}

  /* ---------- main fetch ---------- */
  searchProducts(criteria: ProductSearchCriteria, append = false): void {
    this._lastCriteria = criteria;
    this._loading$.next(true);

    this.http
      .get<ProductSearchResult>(this.apiUrl, {
        params: this.buildHttpParams(criteria),
      })
      .pipe(
        tap((res) => {
          this.logger.debug('Products search success', res);

          if (append) {
            const current = this._products$.value;
            const codes = new Set(current.map((p) => p.code));
            const uniqueNew = res.data.filter((p) => !codes.has(p.code));
            this._products$.next([...current, ...uniqueNew]);
          } else {
            this._products$.next(res.data);
          }

          this._total$.next(res.total);
          this._page$.next(res.page);
          this._pageSize$.next(res.pageSize);
        }),
        catchError((err) => {
          this.logger.error('Products search failed', err);
          this._products$.next([]);
          this._total$.next(0);
          this._page$.next(1);
          this._pageSize$.next(9);
          return of(undefined);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  /* ---------- paging helpers ---------- */
  loadNextPage(): void {
    const next = this._page$.value + 1;
    this.searchProducts({ ...this._lastCriteria, page: next }, true);
  }

  clearProducts(): void {
    this._products$.next([]);
  }

  /* ---------- comparison methods ---------- */
  addToComparison(product: Product): void {
    const current = this._comparisonList$.value;
    if (!current.some((p) => p.code === product.code)) {
      this._comparisonList$.next([...current, product]);
    }
  }

  removeFromComparison(code: string): void {
    this._comparisonList$.next(
      this._comparisonList$.value.filter((p) => p.code !== code)
    );
  }

  clearComparison(): void {
    this._comparisonList$.next([]);
  }

  /* ---------- utils ---------- */
  private buildHttpParams(criteria: ProductSearchCriteria): HttpParams {
    let params = new HttpParams();
    Object.entries(criteria).forEach(([k, v]) => {
      if (v != null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return params;
  }
}
