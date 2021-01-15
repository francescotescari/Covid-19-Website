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


function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number,
): (...args: Params) => void {
  let timer;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

  loading = true;
  loaded = false;
  private loadService: LoadmanagerService;

  constructor(loadService: LoadmanagerService) {
    this.loadService = loadService;
  }


  ngOnInit(): void {
    const setLoaded = debounce(() => this.loaded = true, 200);

    this.loadService.resetCompletion();
    this.loadService.setLoadObservable().subscribe(value => {
      this.loading = true;
      this.loaded = false;
    });
    this.loadService.removeLoadObservable().subscribe(value => {
      this.loading = false;
      setLoaded();
    });

  }

  routerCallback(): void {
    console.log('Rerouting');
    this.loading = true;
    this.loadService.resetCompletion();
  }

}
