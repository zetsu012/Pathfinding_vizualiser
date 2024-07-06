import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualiserComponent } from './visualiser/visualiser.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {path:"" , component:HomepageComponent},
  {path:"visualizer" , component:VisualiserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
