import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ApiCountryCovidEntry, CountryDiffEntry, CovidDiffEntry, CovidSimpleEntry, DatedCovidSimpleEntry} from './covid-data-models';
import {AngularFirestore} from '@angular/fire/firestore';


export interface ApiSummaryModel {
  Global: CovidDiffEntry;
  Countries: Array<CountryDiffEntry>;
}


@Injectable({
  providedIn: 'root'
})
export class CovidDataService {


  constructor(private http: HttpClient, private firestore: AngularFirestore) {

  }


  static CovidDataMapper = (data: CovidDiffEntry) => {
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


  fetchSummary(): Observable<ApiSummaryModel> {
    return this.http.get<ApiSummaryModel>('https://api.covid19api.com/summary', {responseType: 'json'});
  }

  fetchDailyCountry(country: string): Observable<ApiCountryCovidEntry[]> {

    return this.http.get<ApiCountryCovidEntry[]>('https://api.covid19api.com/total/dayone/country/' + country, {responseType: 'json'});
  }


}
