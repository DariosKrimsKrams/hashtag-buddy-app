import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { RouterExtensions } from 'nativescript-angular/router';
import { HashtagCategory } from "~/app/models/hashtag-category";
import { SelectedHashtag } from "~/app/models/selected_hashtag";
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from '@angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Hashtag } from '~/app/models/hashtag';
import * as utils from "tns-core-modules/utils/utils";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import * as frame from "tns-core-modules/ui/frame";
import * as app from "tns-core-modules/application";
import { UserService } from '../../storages/user.service';
import { Photo } from '../../models/photo';

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
  currentScrollingY: number;
  width = "80%";
  page_name = "results";
  countPhotoLeft = 3;
  countPhotosOverall = 5;
  timeStart = 0;
  timeOverall = 0;
  @Input() public customUserHashtagsText: string = "";

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userService: UserService,
    private route: ActivatedRoute,
    private _changeDetectionRef: ChangeDetectorRef,
  ) {
    this.page.actionBarHidden = true;
  }

  ngAfterViewInit(): void {
    this._changeDetectionRef.detectChanges();
  }

  ngOnInit(): void {
    this.selected_hashtags = [];
    const id = Number(this.route.snapshot.params['id']);
    this.photo = this.userService.getPhoto(id);
  }

  public onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View): void {
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

  public copySelected(): void {
    this.dialogOpen = true;
    setTimeout.bind(this)(() => { this.dialogOpen = false; }, 1000);
  }

  public toggleHashtag(tag: Hashtag, titleId: number, tagId: number): void {
    if(this.hightlightStatus[titleId + '_' + tagId]) {
      this.deselectHashtag(titleId, tagId)
    } else {
      this.selectHashtag(tag, titleId, tagId);
    }
  }

  public deselectHashtag(titleId: number, tagId: number): void {
    for(var i = 0; i < this.selected_hashtags.length; i++) {
      var element = this.selected_hashtags[i];
      if(element.tagId == tagId) {
        this.selected_hashtags.splice(i, 1);
        this.hightlightStatus[titleId + '_' + tagId] = false;
        return;
      }
    }
  }

  private selectHashtag(tag: Hashtag, titleId: number, tagId: number): void {
    this.selected_hashtags.push(new SelectedHashtag({name: tag, titleId: titleId, tagId: tagId}));
    this.hightlightStatus[titleId + '_' + tagId] = true;
  }

  private isHashtagSelected(titleId: number, tagId: number) {
    return this.hightlightStatus[titleId + '_' + tagId];
  }

  public selectAll(category: HashtagCategory, titleId): void {
    category.tags.map((tag, tagId) => {
      if(!this.isHashtagSelected(titleId, tagId)) {
        this.selectHashtag(tag, titleId, tagId);
      }
    });
  }
  
  public deselectAll(category: HashtagCategory, titleId): void {
    // Todo deselect all selected
    category.tags.map((tag, tagId) => {
      this.selectHashtag(tag, titleId, tagId);
    });
  }

  public areAllHashtagSelected(category: HashtagCategory, titleId): boolean {
    // Todo logic


    return false;
  }

  public openMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  public closeMenu(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.closeDrawer();
  }

  public goLeaveFeedback(): void {
    var id = this.photo.id;
    this.router.navigate([`/home/leavefeedback/${id}`], {
      transition: {
        name: "slideLeft",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  public dismissSoftKeybaord(): void {
    if (isIOS) {
      frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  public addCustomHashtags(): void {
    var text = this.customUserHashtagsText;
    var hashtag = new Hashtag({title: text});
    this.selected_hashtags.push({name: hashtag, titleId: 0, tagId: 0});
  }

  public getRecommendedAmount(title: string): number {
    switch(title) {
      case 'results_category_niche_hashtags':
        return 2;
      case 'results_category_generic_hashtags':
        return 2;
      default:
        return 0;
    }
  }

}
