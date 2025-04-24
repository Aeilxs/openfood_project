import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlternativesComponent } from './alternatives.component';

const routes: Routes = [{ path: '', component: AlternativesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AlternativesRoutingModule {}
