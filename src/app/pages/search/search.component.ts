import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Hashtag } from '~/app/models/hashtag';
import * as frame from 'tns-core-modules/ui/frame';
import * as utils from 'tns-core-modules/utils/utils';
import { MyHashtag } from '~/app/models/my-hashtag';
import { UserService } from '~/app/storages/user.service';
import { Photo } from '~/app/models/photo';
import { disableIosSwipe } from '~/app/shared/status-bar-util';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  moduleId: module.id
})
export class SearchComponent implements OnInit {

  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page, frame);
    this.calcHeader();
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public dismissSoftKeybaord(): void {
    if (isIOS) {
      frame.Frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }
  public addHashtag(hashtag: Hashtag): void {
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
