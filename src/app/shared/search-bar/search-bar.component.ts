import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '@src/app/services/product/product.service';
import { SearchFilters } from '@src/interfaces';

@Component({
    standalone: true,
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCard, ReactiveFormsModule],
})
export class SearchBarComponent {
    searchForm: FormGroup;
    @Output() search = new EventEmitter<SearchFilters>();
    constructor(private fb: FormBuilder, private productService: ProductService) {
        this.searchForm = this.fb.group({
            search_terms: [''],
            brands: [''],
            categories: [''],
            labels: [''],
            countries: [''],
            nutriments: [''],
            page: [1],
            page_size: [9],
        });
    }

    onSearch(): void {
        const raw = this.searchForm.value;
        const filters: SearchFilters = {
            ...raw,
            brands: raw.brands?.split(',').map((b: string) => b.trim()),
            categories: raw.categories?.split(',').map((c: string) => c.trim()),
            labels: raw.labels?.split(',').map((l: string) => l.trim()),
            countries: raw.countries?.split(',').map((c: string) => c.trim()),
            nutriments: raw.nutriments?.split(',').map((n: string) => n.trim()),
        };

        this.productService.search(filters);
        this.search.emit(filters);
    }
}
