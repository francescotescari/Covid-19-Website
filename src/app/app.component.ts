import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {fadeAnimation} from './animations';
import {LoadmanagerService} from './loadmanager.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  loading = true;
  private loadService: LoadmanagerService;

  constructor(loadService: LoadmanagerService) {
    this.loadService = loadService;
  }


  ngOnInit(): void {
    this.loadService.resetCompletion();
    this.loadService.setLoadObservable().subscribe(value => this.loading = true);
    this.loadService.removeLoadObservable().subscribe(value => this.loading = false);
  }

  routerCallback(): void {
    console.log('Rerouting');
    this.loading = true;
    this.loadService.resetCompletion();
  }

}
