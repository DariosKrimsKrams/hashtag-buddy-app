import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { openUrl } from 'tns-core-modules/utils/utils';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as SocialShare from 'nativescript-social-share';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  moduleId: module.id,
})
export class SettingsComponent implements  OnInit {

  openmenu = false;
  
  constructor(
    private readonly page: Page, 
    private readonly router: RouterExtensions,
  ) {
    this.page.actionBarHidden = true;
  }


  ngOnInit() {
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  goNextPage(route: string) {
    // if(route === 'instagram'){
    //   openUrl("https://www.instagram.com/");      
    // } else if(route === 'facebook') {
    //   openUrl("https://www.facebook.com/");
    // } else if(route === 'twitter') {
    //   openUrl("https://twitter.com/");
    // } else
    if (route === 'legal') {
      openUrl('http://innocliq.de/legal-privacy.html');
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

  share() {
    let text = localize('share') + '\n\n' + localize('link_playstore');
    SocialShare.shareText(text);
  }

  rate() {
    let text = localize('link_playstore');
    openUrl(text);
  }

}
