import {Observable, ReplaySubject} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {AngularFirestoreDocument} from '@angular/fire/firestore';

interface CacheEntry<T> {
  data: T;
  date: number;
}

function debug(...args): void {
  console.log('[DEBUG]', ...args);
}

abstract class CacheLevel<T> {

  protected abstract get(key: string): Observable<CacheEntry<T>>;

  protected abstract set(key: string, value: CacheEntry<T>): void;

  private getSafe(key: string): Observable<CacheEntry<T>> {
    try {
      return this.get(key);
    } catch (e) {
      console.log('Failed to get from cache', e);
      const subject = new ReplaySubject<CacheEntry<T>>();
      subject.next(null);
      return subject;
    }
  }

  private setSafe(key: string, value: CacheEntry<T>): void {
    try {
      return this.set(key, value);
    } catch (e) {
      console.log('Failed to set to cache', e);
    }
  }

  getCached(key: string, timeLimit: number): Observable<T> {
    return this.getSafe(key).pipe(map(next => {
      if (next == null) {
        return null;
      }
      if (new Date().getTime() - next.date > timeLimit) {
        return null;
      }
      return next.data;
    }));
  }

  getOrSet(key: string, timeLimit: number, callable: () => Observable<T>): Observable<T> {
    const result = new ReplaySubject<T>();

    this.getCached(key, timeLimit).subscribe({
      next: value => {
        if (value == null) {
          debug('Value not cached, using callable', this);
          callable().subscribe({
            next: data => {
              result.next(data);
              this.setCached(key, data);
            }
          });
        } else {
          debug('Value found cached', this);
          result.next(value);
        }
      }

    });
    return result;
  }

  setCached(key: string, value: T): void {
    this.setSafe(key, {data: value, date: new Date().getTime()});
  }

}

export class LocalStorageCache<T> extends CacheLevel<T> {

  constructor(private keyPrefix: string) {
    super();
  }

  protected get(key: string): Observable<CacheEntry<T>> {
    const subject = new ReplaySubject<CacheEntry<T>>();
    try {
      subject.next(JSON.parse(localStorage.getItem(this.keyPrefix + key)));
    } catch (e) {
      subject.next(null);
    }
    return subject;
  }

  protected set(key: string, value: CacheEntry<T>): void {
    localStorage.setItem(this.keyPrefix + key, JSON.stringify(value));
  }

}

export class FirestoreDocCache<T> extends CacheLevel<T> {

  constructor(private doc: AngularFirestoreDocument) {
    super();
  }

  protected get(key: string): Observable<CacheEntry<T>> {
    return this.doc.valueChanges().pipe(first()) as Observable<CacheEntry<T>>;
  }

  protected set(key: string, value: CacheEntry<T>): void {
    this.doc.set(value);
  }

}


export class MultiCacheLevel<T> extends CacheLevel<T> {

  private readonly cacheLevels: CacheLevel<T>[];

  constructor(...cacheLevels: CacheLevel<T>[]) {
    super();
    this.cacheLevels = cacheLevels;
  }

  protected get(key: string): Observable<CacheEntry<T>> {
    throw Error('Should never be called');
  }

  getCached(key: string, timeLimit: number): Observable<T> {
    let i = -1;
    const cl = this.cacheLevels;

    function iterNext(): CacheLevel<T> {
      i += 1;
      return cl[i];
    }

    const result = new ReplaySubject<T>();
    const failed: CacheLevel<T>[] = [];

    function goNextLevel(): void {
      let cLevel: CacheLevel<T>;
      try {
        cLevel = iterNext();
      } catch (e) {
        cLevel = null;
      }
      if (cLevel == null) {
        result.next(null);
        return;
      }


      cLevel.getCached(key, timeLimit).subscribe({
        next: value => {
          if (value != null) {
            debug('Getting from success', cLevel);
            for (const toSet of failed) {
              toSet.setCached(key, value);
            }
            result.next(value);

          } else {
            debug('Getting from failed', cLevel);
            failed.push(cLevel);
            goNextLevel();
          }
        }
      });
    }

    goNextLevel();
    return result;


  }

  protected set(key: string, value: CacheEntry<T>): void {
    for (const cacheLevel of this.cacheLevels) {
      // @ts-ignore
      cacheLevel.set(key, value);
    }
  }

}
