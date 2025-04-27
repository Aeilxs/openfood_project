import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from '@src/interfaces';
import { CommonModule } from '@angular/common';
import { ProductService } from '@src/services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatDialogModule, CommonModule],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @ViewChild('detailsModal') detailsModal!: TemplateRef<unknown>;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService
  ) {}

  addToComparison() {
    this.productService.addToComparison(this.product);
  }

  openDetails() {
    this.dialog.open(this.detailsModal, {
      width: '400px',
    });
  }
}
