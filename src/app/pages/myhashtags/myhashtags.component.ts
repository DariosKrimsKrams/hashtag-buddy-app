import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import * as app from 'tns-core-modules/application';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Hashtag } from '~/app/models/hashtag';
import * as frame from 'tns-core-modules/ui/frame';
import * as utils from 'tns-core-modules/utils/utils';
import { MyHashtag } from '~/app/models/my-hashtag';

@Component({
  selector: 'ns-myhashtags',
  templateUrl: './myhashtags.component.html',
  styleUrls: ['./myhashtags.component.scss'],
  moduleId: module.id,
})
export class MyhashtagsComponent implements OnInit {

  public hashtagsOwn: MyHashtag[];
  public hashtagsGenerated: MyHashtag[];

  constructor(
    private readonly page: Page, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.hashtagsOwn = [];
    this.hashtagsOwn.push(new MyHashtag('test', 1));
    this.hashtagsOwn.push(new MyHashtag('bla123syasd', 2));
    
    this.hashtagsGenerated = [];
    this.hashtagsGenerated.push(new MyHashtag('longverylonghashtagdiesdas', 1));
    this.hashtagsGenerated.push(new MyHashtag('catlover', 10));
    this.hashtagsGenerated.push(new MyHashtag('blubb', 5));
    this.hashtagsGenerated.push(new MyHashtag('moep', 2));
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public dismissSoftKeybaord(): void {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  public clickHashtag(name: string): void {

  }

  public addHashtag(hashtag: Hashtag): void {
    let exist = this.hashtagsOwn.filter(x => x.title.toLowerCase() === hashtag.title.toLowerCase())[0] !== undefined;
    if (exist) {
      // sort to first position
      return;
    }
    this.hashtagsOwn.push(new MyHashtag(hashtag.title, 1));
  }

}
