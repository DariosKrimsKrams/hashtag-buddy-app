import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css'],
  moduleId: module.id,
})
export class LegalComponent implements OnInit {

  constructor(private page: Page, private router: RouterExtensions) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

}
