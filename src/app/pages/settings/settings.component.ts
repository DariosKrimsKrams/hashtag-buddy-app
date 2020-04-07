import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { openUrl } from 'tns-core-modules/utils/utils';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as SocialShare from 'nativescript-social-share';
import { localize } from 'nativescript-localize/angular';
import * as frame from 'tns-core-modules/ui/frame';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { isAndroid } from 'tns-core-modules/platform';
import { UserService } from '~/app/storages/user.service';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  moduleId: module.id
})
export class SettingsComponent implements OnInit {
  public headerHeight: number = 0;
  public headerTop: number = 0;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    disableIosSwipe(this.page, frame);
    this.calcHeader();
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public get rateSubline(): string {
    return localize('settings_rate_subline')
      + ' '
      + (isAndroid ? localize('google_play') : localize('app_store'));
  }

  public goNextPage(route: string): void {
    if (route === 'legal') {
      openUrl('https://instaq.app/legal-privacy.html');
    } else {
      this.router.navigate(['/settings/' + route], {
        transition: {
          name: 'slideLeft',
          duration: 500,
          curve: 'easeOut'
        }
      });
    }
  }

  public share(): void {
    const text = localize('share')
      + '\n\n'
      + (isAndroid ? localize('link_playstore') : localize('link_appstore'));
    SocialShare.shareText(text);
  }

  public rate(): void {
    const text = isAndroid ? localize('link_playstore') : localize('link_appstore');
    openUrl(text);
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
