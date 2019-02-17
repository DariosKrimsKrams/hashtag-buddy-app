import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { View } from "tns-core-modules/ui/core/view";

@Component({
  selector: 'ns-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  moduleId: module.id,
})
export class TermsComponent implements OnInit {

  constructor(private page: Page, private router: RouterExtensions) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

}
