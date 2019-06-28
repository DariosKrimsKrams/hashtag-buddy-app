import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Hashtag } from '~/app/models/hashtag';

@Component({
  selector: 'ns-myhashtags',
  templateUrl: './myhashtags.component.html',
  styleUrls: ['./myhashtags.component.css'],
  moduleId: module.id,
})
export class MyhashtagsComponent implements OnInit {

  public hashtags: Hashtag[];

  constructor(
    private readonly page: Page, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.hashtags = [];
    this.hashtags.push(new Hashtag('test'));
    this.hashtags.push(new Hashtag('bla'));
    this.hashtags.push(new Hashtag('catlover'));
    this.hashtags.push(new Hashtag('blubb'));
    this.hashtags.push(new Hashtag('moep'));
    
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public clickHashtag(name: string): void {

  }

}
