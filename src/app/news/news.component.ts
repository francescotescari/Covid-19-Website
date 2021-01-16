import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoadmanagerService} from '../loadmanager.service';
import {NewsService} from '../news.service';
import {ApiCountryModel, CovidDataService} from '../covid-data.service';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CountrySelectorComponent} from '../country-selector/country-selector.component';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, AfterViewInit {
  formControls = {
    title: new FormControl(),
    text: new FormControl(),
    country: new FormControl()
  };
  formGroup = new FormGroup(this.formControls);
  loginName: string = null;
  countrySlug = new BehaviorSubject<string>(null);
  @ViewChild('cSelector') cSelector: CountrySelectorComponent;


  constructor(private loadService: LoadmanagerService,
              private news: NewsService,
              private covid: CovidDataService,
              public auth: AuthService,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const userStatusLoaded = this.loadService.registerLoader();
    this.auth.getUser().subscribe({
      next: next => {
        console.log('User status', next);
        if (next != null) {
          this.loginName = next.displayName;
        }
        userStatusLoaded.complete();
      },
      error: err => {
        userStatusLoaded.complete();
        console.log(err);
      }
    });
  }


  ngAfterViewInit(): void {
    this.formControls.country.valueChanges.subscribe(this.countrySlug);
  }

  onUploaded(error: Error = null): void {
    const msg = error ? 'Failed to upload: ' + error : 'Uploaded successfully!';
    this.snackBar.open(msg, null, {duration: 2000});

    function reset(ctrl: FormControl): void {
      ctrl.reset();
      ctrl.markAsPristine();
      ctrl.markAsUntouched();
    }

    reset(this.formControls.title);
    reset(this.formControls.text);

  }


  logout(): void {
    this.loginName = null;
    const loader = this.loadService.registerLoader();
    this.auth.logout().subscribe({
      next: value => loader.complete(),
      error: err => loader.complete()
    });
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    const values = this.formGroup.value;
    this.news.uploadNews(values.country, values.title, values.text).subscribe({
      next: value => this.onUploaded(),
      error: err => this.onUploaded(err),
    });
  }

  login(): void {
    this.auth.login().subscribe(next => {
      this.loginName = next.user.displayName;
    });
  }
}
