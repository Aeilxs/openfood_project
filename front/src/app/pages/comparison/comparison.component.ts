import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '@src/services/products.service';
import { Product } from '@src/interfaces';

@Component({
  standalone: true,
  selector: 'app-comparison',
  imports: [CommonModule],
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
})
export class ComparisonComponent {
  private readonly productService = inject(ProductService);

  readonly comparison$: Observable<Product[]> =
    this.productService.comparisonList$;

  readonly fields$: Observable<string[]> = this.comparison$.pipe(
    map((products) => {
      const keys = new Set<string>();
      for (const product of products) {
        for (const [key, value] of Object.entries(product)) {
          if (
            value != null &&
            value !== '' &&
            !['code', 'image_url', 'product_name'].includes(key)
          ) {
            keys.add(key);
          }
        }
      }
      return Array.from(keys);
    })
  );

  hasValue(p: Product, key: string): boolean {
    const val = (p as unknown as Record<string, unknown>)[key];
    return val !== null && val !== undefined && val !== '';
  }

  getValue(p: Product, key: string): unknown {
    return (p as unknown as Record<string, unknown>)[key];
  }

  removeProduct(code: string): void {
    this.productService.removeFromComparison(code);
  }

  formatLabel(label: string): string {
    return label
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
}
