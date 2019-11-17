import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { openUrl } from 'tns-core-modules/utils/utils';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as SocialShare from 'nativescript-social-share';
import { localize } from 'nativescript-localize/angular';
import * as frameModule from 'tns-core-modules/ui/frame';
import { isIOS } from 'tns-core-modules/platform';
import { disableIosSwipe } from '~/app/shared/status-bar-util';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  moduleId: module.id
})
export class SettingsComponent implements OnInit {
  public openmenu = false;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    disableIosSwipe(this.page, frameModule);
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
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
    const text = localize('share') + '\n\n' + localize('link_playstore');
    SocialShare.shareText(text);
  }

  public rate(): void {
    const text = localize('link_playstore');
    openUrl(text);
  }
}
