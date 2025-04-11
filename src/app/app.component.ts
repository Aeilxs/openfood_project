import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SearchBarComponent } from './shared/search-bar/search-bar.component';
import { ProductCardComponent } from './shared/product-card/product-card.component';
import { CommonModule } from '@angular/common';

import { ApiService } from '@services/api/api.service';
import { LoggerService } from '@services/logger/logger.service'; // <-- Ajout
import { Product, SearchFilters } from '@src/interfaces';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        MatToolbarModule,
        MatButtonModule,
        SearchBarComponent,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'openfood-project';
    products: Product[] = [];

    constructor(
        private readonly api: ApiService,
        private readonly logger: LoggerService // <-- Ajout
    ) {}

    onSearch(filters: SearchFilters): void {
        this.logger.debug('Search filters:', filters);
        this.api.searchProducts(filters).subscribe({
            next: (response) => {
                this.logger.debug('Products received in AppComponent:', response.products);
                this.products = response.products;

                if (this.products.length === 0) {
                    this.logger.warn('No products found for current filters.');
                } else {
                    this.logger.info(`Loaded ${this.products.length} product(s).`);
                }
            },
            error: (error) => {
                this.logger.error('Error fetching products in AppComponent:', error);
            },
        });
    }
}
