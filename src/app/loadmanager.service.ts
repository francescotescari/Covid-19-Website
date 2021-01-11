import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadmanagerService {

  constructor() {
  }

  private registeredSubjects = new Set();
  private completionSubject = new Subject();
  private setLoadSubject = new Subject();

  registerLoader(): Subject<void> {
    const subject = new Subject<void>();
    this.registeredSubjects.add(subject);
    subject.subscribe({
      complete: () => {
        this.registeredSubjects.delete(subject);
        this.completionSubject.next(subject);
      }
    });
    return subject;
  }

  resetCompletion(): void {
    this.registeredSubjects.clear();
    this.completionSubject.complete();
    this.completionSubject = new Subject<Subject<void>>();
  }

  allLoadedCompletion(): Observable<void> {
    const subject = new ReplaySubject<void>();
    this.completionSubject.subscribe(value => {
      if (this.registeredSubjects.size === 0) {
        subject.complete();
      }
    });
    return subject;
  }

  setLoadObservable(): Observable<unknown> {
    return this.setLoadSubject;
  }

  notifySetLoad(): void {
    this.setLoadSubject.next(0);
  }

}
