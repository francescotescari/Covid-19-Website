import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {HeaderComponent} from './header/header.component';
import {HomepageComponent} from './homepage/homepage.component';
import {HttpClientModule} from '@angular/common/http';
import { SectionComponent } from './page-main/section/section.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import { CountriesTableComponent } from './page-main/elements/countries-table/countries-table.component';
import { CountrypageComponent } from './countrypage/countrypage.component';
import { CoviddataTableComponent } from './page-main/elements/coviddata-table/coviddata-table.component';
import { CoviddataMainComponent } from './page-main/coviddata-main/coviddata-main.component';
import {ChartsModule} from 'ng2-charts';
import { PieChartComponent } from './page-main/elements/pie-chart/pie-chart.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {LoadedNotifyDirective} from './page-main/section/loaded-notify.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    SectionComponent,
    CountriesTableComponent,
    CountrypageComponent,
    CoviddataTableComponent,
    CoviddataMainComponent,
    PieChartComponent,
    LoadedNotifyDirective

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    ChartsModule,
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
