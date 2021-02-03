import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {
  ApiCountryCovidEntry,
  CountryDiffEntry,
  CovidDiffEntry,
  CovidSimpleEntry,
  DatedCovidSimpleEntry, diffToSimpleMapper,
  NinjaApiEntry, ninjaToSimpleMapperDated, simpleToDiffMapperDated
} from './covid-data.models';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {map, tap} from 'rxjs/operators';
import {FirestoreDocCache, LocalStorageCache, MultiCacheLevel} from './caching';


export interface ApiSummaryModel {
  Global: CovidDiffEntry;
  Countries: Array<CountryDiffEntry>;
}

export interface ApiCountryModel {
  Country: string;
  Slug: string;
  ISO2: string;
}

export const WWCountry: ApiCountryModel = {Country: 'Worldwide', Slug: null, ISO2: null};

function timeSinceStartOfTheDay(): number {
  const midnightDate = new Date();
  midnightDate.setHours(0, 0, 0);
  return new Date().getTime() - midnightDate.getTime();
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
    return new LocalStorageCache<ApiSummaryModel>('').getOrSet('data_summary', Math.min(timeSinceStartOfTheDay(), 3600 * 1000),
      () => this.http.get<ApiSummaryModel>('https://api.covid19api.com/summary', {responseType: 'json'}));
  }

  fetchDailyCountry(country: string): Observable<ApiCountryCovidEntry[]> {
    const doc = this.firestore.collection('countries').doc(country);
    const cache = new MultiCacheLevel<ApiCountryCovidEntry[]>(new LocalStorageCache('countries_'), new FirestoreDocCache(doc));

    return cache.getOrSet(country, timeSinceStartOfTheDay(),
      () => this.http.get<ApiCountryCovidEntry[]>('https://api.covid19api.com/total/dayone/country/' + country, {responseType: 'json'}));

  }

  fetchCountries(): Observable<ApiCountryModel[]> {
    return new LocalStorageCache<ApiCountryModel[]>('').getOrSet('countries_data', Math.min(timeSinceStartOfTheDay(), 600 * 1000),
      () => this.http.get<ApiCountryModel[]>('https://api.covid19api.com/countries', {responseType: 'json'}));
  }

  fetchDailyWorld(): Observable<CovidSimpleEntry[]> {
    const result = new ReplaySubject<CovidSimpleEntry[]>();
    this.fetchDailyWorldFallback(result);
    /*
    this.http.get<CovidDiffEntry[]>('https://api.covid19api.com/world?from=2020-04-13T00:00:00Z', {responseType: 'json'})
      .pipe(map(diffToSimpleMapper)).subscribe({
      next: value => {
        if (value.length !== 0 && value[value.length - 1].Confirmed > 0) {
          return result.next(value);
        } else {
          this.fetchDailyWorldFallback(result);
        }
      },
      error: err => this.fetchDailyWorldFallback(result)
    });
     */
    return result;
  }

  private fetchDailyWorldFallback(subj: Subject<CovidSimpleEntry[]>): void {
    this.http.get<NinjaApiEntry>('https://disease.sh/v3/covid-19/historical/all?lastdays=all', {responseType: 'json'})
      .pipe(map(ninjaToSimpleMapperDated)).pipe(map(value => {
      return value.filter(val => new Date(val.Date).getTime() > new Date('2020-04-13T00:00:00Z').getTime());
    })).subscribe(subj);
  }


}
