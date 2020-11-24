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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, AfterContentChecked {
  @ViewChild('fader') fader: ElementRef;

  loading = true;
  isOpen = true;
  lastRoute = null;
  outlet;

  constructor() {

  }

  setOutlet(outlet): void{
    this.outlet = outlet;
  }


  ngAfterContentChecked(): void {
    if (!this.outlet){
      return;
    }
    const route = this.outlet.isActivated ? this.outlet.activatedRoute : null;
    const shouldLoad = this.lastRoute !== route;
    if (!this.loading && shouldLoad){
      this.fader.nativeElement.classList.add('faded');
    } else if (this.loading && !shouldLoad){
      this.fader.nativeElement.classList.remove('faded');
    }
    this.loading = shouldLoad;
    this.lastRoute = route;
    console.log('load', this.loading);
  }

  ngOnInit(): void {

  }
}
