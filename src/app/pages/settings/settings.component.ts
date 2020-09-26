import { Component, OnInit } from '@angular/core';
// import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { UserService } from '~/app/storages/user.service';
import * as SocialShare from '@nativescript/social-share';
import { RouterExtensions } from '@nativescript/angular';
import { Application, isAndroid, isIOS, Page, Utils } from '@nativescript/core';
import { localize } from '@nativescript/localize';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  moduleId: module.id
})
export class SettingsComponent implements OnInit {
  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page);
    this.calcHeader();
  }

  public ngOnInit(): void {
  }

  public openMenu(): void {
    // const sideDrawer = <RadSideDrawer>Application.getRootView();
    // sideDrawer.showDrawer();
  }

  public get rateSubline(): string {
    return localize('settings_rate_subline')
      + ' '
      + (isAndroid ? localize('google_play') : localize('app_store'));
  }

  public goNextPage(route: string): void {
    if (route === 'legal') {
      Utils.openUrl('https://hashtagbuddy.app/legal-privacy.html');
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
    Utils.openUrl(text);
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
