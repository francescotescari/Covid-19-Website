import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ApiCountryModel, CovidDataService, WWCountry} from '../covid-data.service';
import {LoadmanagerService} from '../loadmanager.service';
import {NewsService} from '../news.service';
import {debounceTime, map} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material/form-field';


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

  @Input() defaultValue: ApiCountryModel;
  @Input() appearance: MatFormFieldAppearance;
  @Input() label: string;
  @Input() slugControl: FormControl;
  @Input() disabled = false;
  @Input() forceCountry = true;
  @Input() setValue: Observable<string>;
  @Input() formGroup: FormGroup;
  @Output() selectedCountry = new EventEmitter<ApiCountryModel>();
  private countries: ApiCountryModel[];
  countryFormControl = new StringFormControl();
  filteredOptions: Observable<ApiCountryModel[]>;
  mySelectedCountry: ApiCountryModel;

  constructor(private apis: CovidDataService) {

  }


  ngOnInit(): void {
    this.apis.fetchCountries().subscribe(value => this.countries = value);
    this.filteredOptions = this.countryFormControl.valueChanges
      .pipe(
        map(value => this._filter(value)),
        debounceTime(500)
      );
    if (this.defaultValue == null) {
      this.defaultValue = WWCountry;
    }

    if (this.forceCountry) {
      this.selectCountry(this.defaultValue);
      this.countryFormControl.setValue(this.defaultValue.Country);
    }
    if (this.setValue != null) {
      this.setValue.subscribe(next => {

        setTimeout(() => {
          this.countryFormControl.setValue(next);
        }, 0);

      });
    }
    if (this.formGroup != null) {
      this.formGroup.addControl('country_search', this.countryFormControl);
    }

  }

  private _filter(value: string): ApiCountryModel[] {
    if (this.countries == null) {
      return [];
    }
    const filterValue = value.toLowerCase();

    const res = this.countries.map(c => [c, c.Country.toLowerCase().indexOf(filterValue)]).filter(pair => pair[1] !== -1)
      .sort(((a, b) => (a[1] as number) - (b[1] as number))).map(pair => pair[0]) as ApiCountryModel[];
    res.push(this.defaultValue);
    res.forEach(country => country.toString = () => this.forceCountry ? country.Country : '');
    return res;

  }

  selectCountry(country: ApiCountryModel): void {
    this.mySelectedCountry = country;
    this.selectedCountry.emit(country);
    this.slugControl.setValue(country.Slug);
  }

  onSelect(): void {
    if (this.forceCountry) {
      this.countryFormControl.setValue(this.mySelectedCountry.Country);
    }
  }


}
