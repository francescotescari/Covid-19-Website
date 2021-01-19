import {Directive, ElementRef, HostListener, Injectable, Input, OnInit} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Router} from '@angular/router';


@Directive({
  selector: '[appLoadRouterLink]',
})

export class AppLoadRouterLinkDirective implements OnInit {

  @Input('appLoadRouterLink') loadRouterLink: string;

  constructor(private elr: ElementRef, private loadManager: LoadmanagerService) {

  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent): boolean {
    event.preventDefault();
    event.stopPropagation();
    this.loadManager.rerouteAfterLoad([this.loadRouterLink]);
    return false;
  }

  ngOnInit(): void {
    this.elr.nativeElement.href = this.loadRouterLink;
  }
}


@Injectable({
  providedIn: 'root'
})
export class LoadmanagerService {

  constructor(private router: Router) {
  }


  private registeredSubjects = new Set();
  private setLoadSubject = new Subject();
  private removeLoadSubject = new Subject();

  registerLoader(): Subject<void> {
    const subject = new Subject<void>();
    this.registeredSubjects.add(subject);
    subject.subscribe({
      complete: () => {
        this.registeredSubjects.delete(subject);
        if (this.registeredSubjects.size === 0) {
          this.removeLoadSubject.next(0);
        }
      }
    });
    return subject;
  }

  resetCompletion(): void {
    this.registeredSubjects.clear();
  }


  setLoadObservable(): Observable<unknown> {
    return this.setLoadSubject;
  }

  removeLoadObservable(): Observable<unknown> {
    return this.removeLoadSubject;
  }

  notifySetLoad(): void {
    this.setLoadSubject.next(0);
  }

  public rerouteAfterLoad(commands): void {
    this.notifySetLoad();

    setTimeout(() => {
      this.router.navigate(commands).then(value => {
        if (!value) {
          this.removeLoadSubject.next(0);
        }
      });
    }, 200);
  }

}
