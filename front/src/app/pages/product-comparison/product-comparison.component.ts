import { Component, OnInit } from '@angular/core';
import { ProductService } from '@src/app/services/product/product.service';
import { ProductCardComponent } from '@src/app/shared/product-card/product-card.component';
import { Product } from '@src/interfaces';

@Component({
    selector: 'app-product-comparison',
    templateUrl: './product-comparison.component.html',
    styleUrls: ['./product-comparison.component.scss'],
    imports: [ProductCardComponent],
})
export class ProductComparisonComponent implements OnInit {
    products: Product[] = [];
    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.products$.subscribe((products) => {
            this.products = products;
        });
    }
}
