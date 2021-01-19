import {Injectable} from '@angular/core';
import firebase from 'firebase';
import auth = firebase.auth;
import {AngularFireAuth} from '@angular/fire/auth';
import {from, Observable} from 'rxjs';
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

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    logOnError(from(afAuth.setPersistence(Persistence.LOCAL)));
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
