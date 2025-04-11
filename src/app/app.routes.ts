// app.routes.ts (ou app-routing.module.ts)
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'compare', pathMatch: 'full' },
    {
        path: 'compare',
        loadChildren: () =>
            import('./pages/product-comparison/product-comparison.module').then(
                (m) => m.ProductComparisonModule,
            ),
    },
    {
        path: 'alternatives',
        loadChildren: () =>
            import('./pages/alternatives/alternatives.module').then((m) => m.AlternativesModule),
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then((m) => m.AboutModule),
    },
    { path: '**', redirectTo: 'compare' },
];
