import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { PLAN } from "~/app/pages/data/plans";
import * as app from "application";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'ns-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  moduleId: module.id,
})
export class StoreComponent implements OnInit {

  openmenu = false;
  plans = PLAN;
  
  constructor(
    private page: Page, 
    private router: RouterExtensions
    ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

}
