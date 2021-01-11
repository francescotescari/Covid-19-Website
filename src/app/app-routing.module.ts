import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {CountryPageComponent} from './countrypage/country-page.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'country/:country', component: CountryPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
