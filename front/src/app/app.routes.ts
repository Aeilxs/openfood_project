import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { ComparisonComponent } from './pages/comparison/comparison.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'comparison', component: ComparisonComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' },
];
