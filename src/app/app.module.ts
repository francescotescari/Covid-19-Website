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
import {SectionComponent} from './page-main/section/section.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {CountriesTableComponent} from './page-main/elements/countries-table/countries-table.component';
import {CountryPageComponent} from './countrypage/country-page.component';
import {CoviddataTableComponent} from './page-main/elements/coviddata-table/coviddata-table.component';
import {CovidDataMainComponent} from './page-main/coviddata-main/covid-data-main.component';
import {ChartsModule} from 'ng2-charts';
import {PieChartComponent} from './page-main/elements/pie-chart/pie-chart.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DailyBarChartComponent} from './page-main/elements/daily-bar-chart/daily-bar-chart.component';
import {DailyLineChartComponent} from './page-main/elements/daily-line-chart/daily-line-chart.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AppLoadRouterLinkDirective} from './loadmanager.service';
import {NewsComponent} from './news/news.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {CountrySelectorComponent} from './country-selector/country-selector.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    SectionComponent,
    CountriesTableComponent,
    CountryPageComponent,
    CoviddataTableComponent,
    CovidDataMainComponent,
    PieChartComponent,
    DailyBarChartComponent,
    DailyLineChartComponent,
    DailyLineChartComponent,
    AppLoadRouterLinkDirective,
    NewsComponent,
    CountrySelectorComponent

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
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule {
}
