import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'ns-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  moduleId: module.id,
})

export class ErrorComponent implements OnInit {

  constructor(
    private readonly page: Page, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

}
