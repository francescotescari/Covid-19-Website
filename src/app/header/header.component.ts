import {Component, OnInit} from '@angular/core';
import {LoadmanagerService} from '../loadmanager.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  slugControl = new FormControl();
  disabled = false;

  constructor(public loadManager: LoadmanagerService) {
  }

  ngOnInit(): void {
    // this.loadManager.removeLoadObservable().subscribe(value => this.disabled = false);
    this.slugControl.valueChanges.subscribe(slug => {
     // this.slugControl.reset();
      this.disabled = true;
      this.loadManager.rerouteAfterLoad(['/country/' + slug]);
    });
  }

}
