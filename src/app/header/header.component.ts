import {Component, OnInit} from '@angular/core';
import {LoadmanagerService} from '../loadmanager.service';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  slugControl = new FormControl();
  searchValue = new BehaviorSubject('');
  formGroup = new FormGroup({});


  constructor(public loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    this.slugControl.valueChanges.subscribe(slug => {
      this.searchValue.next('');
      (document.activeElement as HTMLElement).blur();
      const path = slug == null ? '/' : '/country/' + slug;
      this.loadManager.rerouteAfterLoad([path]);
    });
  }

}
