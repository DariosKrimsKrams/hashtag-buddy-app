import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  moduleId: module.id,
})
export class TermsComponent implements OnInit {

  constructor(private page: Page, private router: RouterExtensions) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

}
