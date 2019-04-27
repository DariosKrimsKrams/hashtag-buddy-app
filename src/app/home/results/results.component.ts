import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { RouterExtensions } from 'nativescript-angular/router';
import { HashtagCategory } from "~/app/models/hashtag-category";
import { ResultSelectionHashtag } from "~/app/models/result-selection-hashtag";
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
import { ResultSelectionHashtags } from '~/app/models/result-selection-hashtags';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ns-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  moduleId: module.id,
})
export class ResultsComponent implements AfterViewInit, OnInit {

  public menus = ["home", "settings", "store", "faq", "feedback"];
  public parallaxHeight = 250;
  public photo: Photo;
  public dialogOpen: boolean;
  public openmenu: boolean;
  public selectedHashtags: ResultSelectionHashtags;
  public hightlightStatus: Array<boolean> = [];
  public currentScrollingY: number;
  @Input() public customUserHashtagsText: string = "";
  @Output() public resetInput: EventEmitter<void> = new EventEmitter();
  
  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
  ) {
    this.page.actionBarHidden = true;
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.selectedHashtags = new ResultSelectionHashtags();
    const id = Number(this.route.snapshot.params['id']);
    this.photo = this.userService.getPhoto(id);
    this.selectedHashtags.fromPhoto(this.photo);
    this.selectedHashtags.hashtags.forEach(hashtag => {
      this.hightlightStatus[hashtag.titleId + '_' + hashtag.tagId] = true;
    });
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
      this.deselectHashtag(tag.title)
    } else {
      this.selectHashtag(tag, titleId, tagId);
    }
  }

  public deselectHashtag(name: string): void {
    for(var i = 0; i < this.selectedHashtags.length; i++) {
      var hashtag = this.selectedHashtags.hashtags[i];
      if(hashtag.hashtag.title == name) {
        this.selectedHashtags.splice(i, 1);
        if(hashtag.titleId != -1 && hashtag.tagId != -1) {
          this.hightlightStatus[hashtag.titleId + '_' + hashtag.tagId] = false;
        }
        this.selectionChanged();
        return;
      }
    }
  }

  private selectHashtag(tag: Hashtag, titleId: number, tagId: number): void {
    this.selectedHashtags.push(new ResultSelectionHashtag({hashtag: tag, titleId: titleId, tagId: tagId}));
    this.hightlightStatus[titleId + '_' + tagId] = true;
    this.selectionChanged();
  }

  private isHashtagSelected(titleId: number, tagId: number) {
    return this.hightlightStatus[titleId + '_' + tagId];
  }

  public selectAll(category: HashtagCategory, titleId: number): void {
    category.tags.map((tag, tagId) => {
      if(!this.isHashtagSelected(titleId, tagId)) {
        this.selectHashtag(tag, titleId, tagId);
      }
    });
  }
  
  public deselectAll(category: HashtagCategory, titleId: number): void {
    category.tags.map((tag, tagId) => {
      this.deselectHashtag(tag.title);
    });
  }

  public areAllHashtagSelected(category: HashtagCategory, titleId: number): boolean {
    for(var i = 0; i < category.tags.length; i++) {
      var tagId = i;
      if(!this.isHashtagSelected(titleId, tagId)) {
        return false;
      }
    }
    return true;
  }

  public addCustomHashtags(): void {
    var input = this.customUserHashtagsText;
    input.split(' ').map(word => {
      if(word.length != 0) {
        word.split('#').map(word2 => {
          if(word2.length != 0) {
            this.addHashtag(word2);
          }
        });
      }
    });
    this.resetInput.emit();
  }

  private addHashtag(name: string): void {
    var exist = this.selectedHashtags.hashtags.filter(x => x.hashtag.title.toLowerCase() == name.toLowerCase())[0] !== undefined;
    if(exist) {
      return;
    }
    if(this.selectHashtagIfExist(name)) {
      return;
    }
    var hashtag = new Hashtag({title: name});
    this.selectedHashtags.push({hashtag: hashtag, titleId: -1, tagId: -1});
    this.selectionChanged();
  }

  private selectHashtagIfExist(name: string): boolean {
    for(var i = 0; i < this.photo.categories.length; i++) {
      var category = this.photo.categories[i];
      for(var j = 0; j < category.tags.length; j++) {
        var hashtag = category.tags[j]
        if(hashtag.title == name.toLowerCase()) {
          this.selectHashtag(hashtag, i, j);
          return true;
        }
      }
    }
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

  private selectionChanged(): void {
    this.photo.selectedHashtags = this.selectedHashtags.toSelectedHashtags();
    this.userService.updatePhoto(this.photo);
  }

  public clickedCensoredHashtag(): void {
    // var text = localize('share');
    Toast.makeText("Hashtag is hidden due to Free-Mode :'(").show();
  }

}
