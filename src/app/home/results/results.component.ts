import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { RouterExtensions } from 'nativescript-angular/router';
import { HashtagCategory } from "~/app/models/hashtag-category";
import { SelectedHashtag } from "~/app/models/selected_hashtag";
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "ui/page";
import { ActivatedRoute } from '@angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Hashtag } from '~/app/models/hashtag';
import * as utils from "utils/utils";
import { isIOS, isAndroid } from "platform";
import * as frame from "ui/frame";
import * as app from "application";
import { UserService } from '../../storages/user.service';
import { Photo } from '../../models/photo';
import { DeviceService } from '../../services/device-photos.service';

@Component({
  selector: 'ns-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  moduleId: module.id,
})
export class ResultsComponent implements AfterViewInit, OnInit {

  menus = ["home", "settings", "store", "faq", "feedback"];
  parallaxHeight = 250;

  hashtags: HashtagCategory[];
  photo: Photo;
  dialogOpen: boolean;
  openmenu: boolean;
  selected_hashtags: SelectedHashtag[];
  hightlightStatus: Array<boolean> = [];
  // selected = [];
  // photo: ImageAsset; // any?
  currentScrollingY: number;

  width = "80%";
  page_name = "results";
  countPhotoLeft = 3;
  countPhotosOverall = 5;
  timeStart = 0;
  timeOverall = 0;
  
  @Input() customUserHashtagsText: string = "";

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userStorage: UserService,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private _changeDetectionRef: ChangeDetectorRef,
  ) {
    this.page.actionBarHidden = true;
  }

  ngAfterViewInit() {
    this._changeDetectionRef.detectChanges();
  }

  ngOnInit() {
    this.selected_hashtags = [];


    const id = Number(this.route.snapshot.params['id']);
    console.log("got photo with id", id);
    this.photo = this.userStorage.getPhoto(id);

    console.log(this.photo);

    this.photo.image = this.deviceService.getSelectedPhoto();

    // this.hashtags = this.userStorage.getHashtags(id);
    // this.hashtags = this.photo.categories;
    // this.selected[0] = true;
  }

  onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
    this.currentScrollingY = scrollView.verticalOffset;
    if (scrollView.verticalOffset <= this.parallaxHeight) {
      const offset = scrollView.verticalOffset / 2;
      if (scrollView.ios) {
        topView.animate({ translate: { x: 0, y: offset }, duration: 200 });
      } else {
        topView.translateY = Math.floor(offset);
      }
    }
  }

  copyTop20() {    
    this.dialogOpen = true;
    setTimeout (() => { this.dialogOpen = false; }, 1000);
  }

  copySelected() {
    this.dialogOpen = true;
    setTimeout (() => { this.dialogOpen = false; }, 1000);
  }

  selectHashtag(tag: Hashtag, title_id, tag_id) {
    if(this.hightlightStatus[title_id + '_' + tag_id] === true) {
      this.removeHashtag(title_id, tag_id)
    } else {
      this.addHashtag(tag, title_id, tag_id);
    }

  }

  removeHashtag(title_id, tag_id) {
    for(var i = 0; i < this.selected_hashtags.length; i++) {
      var element = this.selected_hashtags[i];
      if(element.tag_id == tag_id) {
        this.selected_hashtags.splice(i, 1);
        this.hightlightStatus[title_id + '_' + tag_id]=false;
        return;
      }
    }
  }

  addHashtag(tag: Hashtag, title_id, tag_id) {
    this.selected_hashtags.push({name: tag, title_id: title_id, tag_id: tag_id});
    this.hightlightStatus[title_id + '_' + tag_id] = true;
  }

  selectAll(hashtag: HashtagCategory, title_id) {
    // Todo only not already added
    hashtag.tags.map((tag, tag_id) => {
      this.addHashtag(tag, title_id, tag_id);
    });
  }

  areAllHashtagSelected(hashtag: HashtagCategory, title_id) {
    return false;
  }

  openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  closeMenu() {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  // openPage(index: number) {
  //   this.selected = [];
  //   this.selected[index] = true;
  //   this.closeMenu();
  //   this.router.navigate(["/" + this.menus[index]], {
  //     transition: {
  //       name: "fadeIn",
  //       duration: 500,
  //       curve: "easeOut"
  //     }
  //   });
  // }

  goLeaveFeedback() {
    this.router.navigate(["/home/leavefeedback"], {
      transition: {
        name: "slideLeft",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  dismissSoftKeybaord() {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  addCustomHashtags() {
    var text = this.customUserHashtagsText;
    var hashtag = new Hashtag({title: text});
    this.selected_hashtags.push({name: hashtag, title_id: 0, tag_id: 0});
  }

}
