import { Component, OnInit } from '@angular/core';
import {LoadmanagerService} from '../loadmanager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public loadManager: LoadmanagerService) { }

  ngOnInit(): void {
  }

}
