import {Injectable} from '@angular/core';
import firebase from 'firebase';
import auth = firebase.auth;
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, from, Observable, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {LocalStorageCache} from './caching';
import Persistence = firebase.auth.Auth.Persistence;
import {logOnError} from './utils';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userState = new BehaviorSubject<User>(null);

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    logOnError(from(afAuth.setPersistence(Persistence.LOCAL)));
    this.afAuth.user.subscribe(this.userState);
    this.afAuth.authState.subscribe(this.userState);
    this.userState.subscribe(next => console.log('User status', next));
  }


  getUser(): Observable<User> {
    return this.afAuth.user;
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }


  login(): Observable<auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()));
  }
}
