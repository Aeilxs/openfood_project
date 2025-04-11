import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '@src/interfaces';
import { LoggerService } from '@src/app/services/logger/logger.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [MatExpansionModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
    constructor(private readonly logger: LoggerService) {}
    @Input() product!: Product;

    ngOnInit(): void {
        this.logger.debug('[ProductCardComponent] Init with product:', this.product);
    }
}
