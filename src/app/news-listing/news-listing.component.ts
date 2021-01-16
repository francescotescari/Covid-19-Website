import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DocNewsEntry, NewsEntry, NewsService} from '../news.service';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

function padString(obj: any, len: number, pad: string = '0'): string {
  let s = obj.toString();
  while (s.length < len) {
    s = pad + s;
  }
  return s;
}

@Component({
  selector: 'app-news-listing',
  templateUrl: './news-listing.component.html',
  styleUrls: ['./news-listing.component.css']
})
export class NewsListingComponent implements OnInit {

  newsData: DocNewsEntry[] = null;
  @Input() countrySlugObservable: Observable<string>;
  @Input() showDelete = false;
  countrySlug: string;


  constructor(private news: NewsService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.countrySlugObservable.subscribe(next => {
      this.news.listNews(next).subscribe(news => this.newsData = news.sort(((a, b) => b.data.date - a.data.date)));
      this.countrySlug = next;
    });

  }

  dateOf(ts: number): string {
    const d = new Date(ts);
    return padString(d.getHours(), 2, '0') + ':' + padString(d.getMinutes(), 2, '0') + ' ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear() % 100);
  }

  delete(entry: DocNewsEntry, country: string): void {
    this.news.delete(country, entry.id).subscribe({
      next: value => this.snackBar.open('Deleted successfully!', null, {duration: 2000}),
      error: err => this.snackBar.open('Failed to delete: ' + err, null, {duration: 2000}),
    });
  }

}
