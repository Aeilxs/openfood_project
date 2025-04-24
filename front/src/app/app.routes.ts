// app.routes.ts (ou app-routing.module.ts)
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'compare',
        loadChildren: () =>
            import('./pages/product-comparison/product-comparison.module').then(
                (m) => m.ProductComparisonModule
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
    { path: '**', redirectTo: '' },
];
