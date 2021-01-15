import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiCountryModel, CovidDataService} from '../covid-data.service';
import {LoadmanagerService} from '../loadmanager.service';
import {NewsService} from '../news.service';
import {debounceTime, map} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material/form-field';


const WWCountry = {Country: 'Worldwide', Slug: null, ISO2: null};

class StringFormControl extends FormControl {
  setValue(value: any,
           options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }): void {
    if (typeof value !== 'string') {
      return;
    }
    return super.setValue(value, options);
  }
}

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.css']
})
export class CountrySelectorComponent implements OnInit {

  @Input('countriesSource') countriesSource: Observable<ApiCountryModel[]>;
  @Input('defaultValue') defaultValue: ApiCountryModel;
  @Input('appearance') appearance: MatFormFieldAppearance;
  @Input('label') label: string;
  @Input('formGroup') formGroup: FormGroup;
  @Output('selectedCountry') selCountryEmitter = new EventEmitter<ApiCountryModel>();
  private countries: ApiCountryModel[];
  slugControl = new FormControl();
  countryFormControl = new StringFormControl();
  filteredOptions: Observable<ApiCountryModel[]>;
  selectedCountry: ApiCountryModel;


  ngOnInit(): void {
    this.countriesSource.subscribe(value => this.countries = value);
    this.filteredOptions = this.countryFormControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
        debounceTime(500)
      );
    if (this.defaultValue == null) {
      this.defaultValue = WWCountry;
    }
    if (this.formGroup != null) {
      this.formGroup.addControl('country', this.slugControl);
    }
    this.selectCountry(this.defaultValue);
    this.countryFormControl.setValue(this.defaultValue.Country);

  }

  private _filter(value: string): ApiCountryModel[] {
    if (this.countries == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const res = this.countries.map(c => [c, c.Country.toLowerCase().indexOf(filterValue)]).filter(pair => pair[1] !== -1)
      .sort(((a, b) => (a[1] as number) - (b[1] as number))).map(pair => pair[0]) as ApiCountryModel[];
    res.push(this.defaultValue);
    return res;

  }

  selectCountry(country: ApiCountryModel): void {
    this.selectedCountry = country;
    this.selCountryEmitter.emit(country);
    this.slugControl.setValue(country.Slug);
  }


}
