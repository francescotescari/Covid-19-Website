import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {Observable, ReplaySubject} from 'rxjs';

interface NewsEntry {
  title: string;
  content: string;
  author: string;
  date: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private countryId(country: string): string {
    return country || 'world';
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
        date: new Date().getTime()
      };
      console.log('Uploading news', countryId, data);
      this.firestore.collection('news').doc('news').collection(countryId).add(data).then(res => result.next(res)).catch(err => result.error(err));
    });
    return result;


  }
}
