import { Component, OnInit, OnDestroy, Signal, effect } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '@src/services/products.service';
import { ProductCardComponent } from '@src/shared/product-card/product-card.component';
import { Product } from '@src/interfaces';

import { combineLatest, firstValueFrom, fromEvent, Subscription } from 'rxjs';
import { throttleTime, map, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ProductCardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  readonly products$;
  readonly total$;
  readonly page$;
  readonly pageSize$;
  readonly loading$;

  isLoading = false;
  allLoaded = false;

  form: FormGroup;
  nutriscoreOptions = ['a', 'b', 'c', 'd', 'e'];
  showAdvancedFilters = false;
  hasSearched = false;

  private scrollSub?: Subscription;

  constructor(
    private readonly productService: ProductService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      q: [''],
      brand: [''],
      category: [''],
      nutriscore: [''],
      minKcal: [null],
      maxKcal: [null],
    });

    this.products$ = this.productService.products$;
    this.total$ = this.productService.totalProducts$;
    this.page$ = this.productService.page$;
    this.pageSize$ = this.productService.pageSize$;
    this.loading$ = this.productService.loader$;

    this.productService.loader$.subscribe((l) => (this.isLoading = l));
  }

  ngOnInit(): void {
    this.scrollSub = fromEvent(window, 'scroll')
      .pipe(
        throttleTime(150),
        map(
          () =>
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100
        ),
        filter((atBottom) => atBottom)
      )
      .subscribe(() => this.onScrolledToBottom());
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
  }

  onSearch(): void {
    if (this.isLoading) return;
    this.allLoaded = false;

    const criteria = { ...this.form.value, page: 1, pageSize: 10 };
    this.productService.clearProducts();
    this.productService.searchProducts(criteria);
  }

  async onScrolledToBottom(): Promise<void> {
    if (this.isLoading || this.allLoaded) return;

    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    const threshold = 150; // px

    if (windowBottom >= docHeight - threshold) {
      const [page, size, total] = await firstValueFrom(
        combineLatest([this.page$, this.pageSize$, this.total$]).pipe(take(1))
      );

      if (page * size >= total) {
        this.allLoaded = true;
        return;
      }

      this.productService.loadNextPage();
    }
  }
}
