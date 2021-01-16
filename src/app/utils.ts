import {Observable} from 'rxjs';

export function logOnError(observable: Observable<any>): void {
  observable.subscribe({error: err => console.log('Observable error: ', err)});
}
