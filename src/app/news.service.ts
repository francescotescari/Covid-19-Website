import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {from, Observable, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export interface NewsEntry {
  title: string;
  content: string;
  author: string;
  date: number;
  uimg: string;
}

export interface DocNewsEntry {
  id: string;
  data: NewsEntry;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private countryId(country: string): string {
    return 'news/countries/' + (country || 'world');
  }

  constructor(private firestore: AngularFirestore, private auth: AuthService) {
  }

  uploadNews(country: string, title: string, content: string): Observable<DocumentReference> {
    const countryId = this.countryId(country);
    const result = new ReplaySubject<DocumentReference>();
    this.auth.getUser().subscribe(user => {
      if (user == null) {
        result.error(Error('Not authenticated'));
        return;
      }
      const data: NewsEntry = {
        title,
        content,
        author: user.displayName,
        date: new Date().getTime(),
        uimg: user.img,
      };
      this.firestore.collection(countryId).add(data).then(res => result.next(res)).catch(err => result.error(err));
    });
    return result;


  }

  listNews(country: string): Observable<DocNewsEntry[]> {
    const result = new ReplaySubject<DocNewsEntry[]>();
    const countryId = this.countryId(country);
    const coll = this.firestore.collection(countryId);
    coll.snapshotChanges().subscribe(snaps => {
      coll.get().subscribe(query => {
        result.next(query.docs.map(doc => {
          return {id: doc.id, data: doc.data() as NewsEntry};
        }));
      });
    });
    return result;
  }

  delete(country: string, docId: string): Observable<any> {
    return from(this.firestore.collection(this.countryId(country)).doc(docId).delete());
  }
}
