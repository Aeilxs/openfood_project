import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComparisonComponent } from './product-comparison.component';

const routes: Routes = [{ path: '', component: ProductComparisonComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductComparisonRoutingModule {}
