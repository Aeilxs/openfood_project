import { Component, OnInit } from '@angular/core';
import { ProductService } from '@src/app/services/product/product.service';
import { ProductCardComponent } from '@src/app/shared/product-card/product-card.component';
import { Product } from '@src/interfaces';

@Component({
    selector: 'app-alternatives',
    templateUrl: './alternatives.component.html',
    styleUrls: ['./alternatives.component.scss'],
    imports: [ProductCardComponent],
})
export class AlternativesComponent implements OnInit {
    products: Product[] = [];

    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.products$.subscribe((products) => {
            this.products = products;
        });
    }
}
