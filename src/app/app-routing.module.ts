import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {CountrypageComponent} from './countrypage/countrypage.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'country/:country', component: CountrypageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
