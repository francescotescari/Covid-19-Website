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
export class AppComponent implements OnInit, AfterViewInit {

  loading = true;
  private loadService: LoadmanagerService;

  constructor(loadService: LoadmanagerService) {
    this.loadService = loadService;
  }

  ngAfterViewInit(): void {
    this.loadService.allLoadedCompletion().subscribe({
      complete: () => this.loading = false
    });
  }

  ngOnInit(): void {
    this.loadService.resetCompletion();
    this.loadService.setLoadObservable().subscribe(value => this.loading = true);
  }

  routerCallback(): void {
    this.loading = true;
    this.loadService.resetCompletion();
    this.loadService.allLoadedCompletion().subscribe({
      complete: () => this.loading = false
    });
  }

}
