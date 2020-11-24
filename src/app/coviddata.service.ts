import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CoviddataModel} from './section/coviddata.model';
import {CountriesEntryModel} from './countries-entry.model';
import {LocalCachingService} from './local-caching.service';
import {tap} from 'rxjs/operators';

export interface ApiSummaryModel {
  Global: CoviddataModel;
  Countries: Array<CountriesEntryModel>;
}


@Injectable({
  providedIn: 'root'
})
export class CoviddataService {

  static CovidDataMapper = data => {
    return [
      {key: 'Total Cases', value: data.TotalConfirmed},
      {key: 'New Cases', value: data.NewConfirmed},
      {key: 'Total Recovered', value: data.TotalRecovered},
      {key: 'New Recovered', value: data.NewRecovered},
      {key: 'Recovery Rate', value: (data.TotalRecovered / data.TotalConfirmed * 100).toFixed(2) + '%'},
      {key: 'Total Deaths', value: data.TotalDeaths},
      {key: 'New Deaths', value: data.NewDeaths},
      {key: 'Mortality Rate', value: (data.TotalDeaths / data.TotalConfirmed * 100).toFixed(2) + '%'}
    ];
  };

  static GlobalCountryDataMapper = data => data.Countries;


  constructor(private http: HttpClient, private cache: LocalCachingService) {

  }

  fetchSummary(): Observable<ApiSummaryModel> {
    return this.getCached<ApiSummaryModel>('https://api.covid19api.com/summary', 3600, {responseType: 'json'});
  }

  private getCached<T>(url, cacheDuration, ...args): Observable<T> {
    const key = 'url+' + url;
    const data = this.cache.get<T>(key, cacheDuration);

    if (data) {
      console.log('Data retrieved cached');
      const x = of(data);
      return of(data);
    } else {
      console.log('Data not retrieved cached');
      args.unshift(url);
      return this.http.get.apply(this.http, args).pipe(tap({
        next: value => this.cache.set(key, value)
      }));
    }
  }

}
