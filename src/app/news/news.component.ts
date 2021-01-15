import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoadmanagerService} from '../loadmanager.service';
import {NewsService} from '../news.service';
import {ApiCountryModel, CovidDataService} from '../covid-data.service';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, AfterViewInit {
  private loadedStatus: Subject<any>;
  countriesDataSubject = new ReplaySubject<ApiCountryModel[]>();
  formControls = {
    title: new FormControl(),
    text: new FormControl()
  };
  formGroup = new FormGroup(this.formControls);
  loginName: string = null;


  constructor(private loadService: LoadmanagerService,
              private news: NewsService,
              private covid: CovidDataService,
              public auth: AuthService,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.loadedStatus = this.loadService.registerLoader();
    this.auth.getUser().subscribe(next => {
      if (next != null) {
        this.loginName = next.displayName;
      }
    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.covid.fetchCountries().subscribe(next => {
        this.countriesDataSubject.next(next);
        this.loadedStatus.complete();
      });
    }, 0);
  }

  onUploaded(error: Error = null): void {
    const msg = error ? 'Failed to upload' + error : 'Uploaded successfully!';
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
    this.auth.logout().subscribe(next => {
      loader.complete();
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
