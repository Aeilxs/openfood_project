import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchFilters } from '@src/interfaces';

@Component({
    standalone: true,
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCard, ReactiveFormsModule],
})
export class SearchBarComponent {
    @Input() searching: boolean = false;
    @Output() search = new EventEmitter<SearchFilters>();

    searchForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            search_terms: [''],
            brands: [''],
            categories: [''],
            labels: [''],
            countries: [''],
            nutriments: [''],
            page: [1],
            page_size: [10],
        });
    }

    onSearch(): void {
        if (this.searching) return;

        const raw = this.searchForm.value;
        const filters: SearchFilters = {
            ...raw,
            brands: raw.brands?.split(',').map((b: string) => b.trim()),
            categories: raw.categories?.split(',').map((c: string) => c.trim()),
            labels: raw.labels?.split(',').map((l: string) => l.trim()),
            countries: raw.countries?.split(',').map((c: string) => c.trim()),
            nutriments: raw.nutriments?.split(',').map((n: string) => n.trim()),
        };

        this.search.emit(filters);
    }
}
