import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { View } from "tns-core-modules/ui/core/view";

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
