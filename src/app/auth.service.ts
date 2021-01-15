import {Injectable} from '@angular/core';
import firebase from 'firebase';
import auth = firebase.auth;
import {AngularFireAuth} from '@angular/fire/auth';
import {from, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LocalStorageCache} from './caching';

interface User {
  uid: string;
  displayName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User;
  private localCache = new LocalStorageCache<User>('login_');

  constructor(
    private afAuth: AngularFireAuth,
  ) {
  }


  getUser(): Observable<User> {
    return this.localCache.getCached('user', 10 * 60 * 1000);
  }

  logout(): Observable<void> {
    this.user = null;
    this.localCache.remove('user');
    return from(this.afAuth.signOut());
  }

  loggedIn(): boolean {
    return this.user != null;
  }


  login(): Observable<auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())).pipe(tap(value => {
      this.user = {
        uid: value.user.uid,
        email: value.user.email,
        displayName: value.user.displayName,
      };
      this.localCache.setCached('user', this.user);
    }));
  }
}
