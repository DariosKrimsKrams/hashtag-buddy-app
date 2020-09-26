import { Component, OnInit } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { UserService } from '~/app/storages/user.service';
import { isIOS, Application, Page } from '@nativescript/core';

@Component({
  templateUrl: './historyoverview.component.html',
  styleUrls: ['./historyoverview.component.scss'],
  moduleId: module.id
})
export class HistoryoverviewComponent implements OnInit {
  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly userService: UserService,
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page);
    this.calcHeader();
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
