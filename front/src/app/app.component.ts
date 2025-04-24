import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SearchBarComponent } from './shared/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';
import { LoggerService } from '@services/logger/logger.service'; // <-- Ajout
import { Product, SearchFilters } from '@src/interfaces';
import { ProductService } from './services/product/product.service';

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
        private readonly logger: LoggerService,
        private readonly router: Router,
        private readonly productService: ProductService
    ) {}

    isSearching = false;
    onSearch(filters: SearchFilters): void {
        if (this.isSearching) return;

        this.logger.debug('Search filters:', filters);
        this.isSearching = true;

        this.productService.search(filters);

        this.productService.products$.subscribe({
            next: (products) => {
                if (products.length === 0) {
                    this.logger.warn('No products found for current filters.');
                } else {
                    this.logger.info(`Loaded ${products.length} product(s).`);
                }
                this.isSearching = false;
            },
            error: (err) => {
                this.logger.error('Error during search via ProductService:', err);
                this.isSearching = false;
            },
        });
    }

    showSearchBar(): boolean {
        return this.router.url === '/' || this.router.url === '/about';
    }
}
