import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { openUrl } from "utils/utils";
import * as app from "application";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as SocialShare from "nativescript-social-share";
import { ImageSource, fromFile, fromResource } from "tns-core-modules/image-source";
import {Folder, path, knownFolders} from "tns-core-modules/file-system";
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  moduleId: module.id,
})
export class SettingsComponent implements  OnInit {

  openmenu = false;
  
  constructor(
    private page: Page, 
    private router: RouterExtensions,
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

  goNextPage(route: string) {
    if(route === 'instagram'){
      openUrl("https://www.instagram.com/");      
    } else if(route === 'facebook') {
      openUrl("https://www.facebook.com/");
    } else if(route === 'twitter') {
      openUrl("https://twitter.com/");
    } else {
      this.router.navigate(["/settings/" + route], {
        transition: {
          name: "slideLeft",
          duration: 500,
          curve: "easeOut"
        }
      })
    }    
  }

  share() {
    var text = localize('share');

    // const folder: Folder = <Folder> knownFolders.currentApp();
    // const folderPath: string = path.join(folder.path, "assets/images/3.png");
    // const image: ImageSource = <ImageSource> fromFile(folderPath);
    // let image = fromFile("~/3.png");
    // SocialShare.shareImage(image, text);

    SocialShare.shareText(text);
  }

  rate() {

  }

}
