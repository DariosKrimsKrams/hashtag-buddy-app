import { Component, OnInit } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Page } from 'tns-core-modules/ui/page/page';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';

@Component({
  templateUrl: './historyoverview.component.html',
  styleUrls: ['./historyoverview.component.scss'],
  moduleId: module.id
})
export class HistoryoverviewComponent implements OnInit {

  constructor(
    private readonly page: Page,
  ) {
    this.page.actionBarHidden = true;
    disableIosSwipe(this.page, frame);
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

}
