import { Component, OnInit, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { RouterExtensions } from 'nativescript-angular/router';
import { HashtagCategory } from '~/app/models/hashtag-category';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page';
import { ActivatedRoute } from '@angular/router';
import { Hashtag } from '~/app/models/hashtag';
import * as utils from 'tns-core-modules/utils/utils';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import * as frame from 'tns-core-modules/ui/frame';
import { UserService } from '../../../storages/user.service';
import { Photo } from '../../../models/photo';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/shared/modal/modal.component';
import { Toasty, ToastDuration } from 'nativescript-toasty';
import { localize } from 'nativescript-localize/angular';

@Component({
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  moduleId: module.id
})
export class ResultsComponent implements OnInit {

  @Output() public hashtagsChanged: EventEmitter<void> = new EventEmitter();
  public parallaxHeight = 250;
  public photo: Photo;
  public selectedHashtags: string[] = [];
  public excludedHashtags: string[] = [];
  public currentScrollingY: number = 0;
  public categories: HashtagCategory[] = [];
  private hasAnyInteraction: boolean = false;
  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly userService: UserService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly modalService: ModalDialogService,
    private readonly route: ActivatedRoute
  ) {
    this.page.actionBarHidden = true;
    this.page.enableSwipeBackNavigation = false;
    this.isIOS = isIOS;
  }

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.photo = this.userService.getPhoto(id);
    this.categories = Object.assign([], this.photo.categories);
    for (let i = 0; i < this.photo.selectedHashtags.length; i++) {
      this.selectedHashtags.push(this.photo.selectedHashtags[i].title);
    }
    this.addFavoriteHashtags();
    this.setExcludedHashtags();
  }

  private addFavoriteHashtags(): void {
    const favoritCat = new HashtagCategory();
    favoritCat.title = 'results_category_favorites';
    const favorites = this.userService.getFavorites();
    favoritCat.tags = [];
    favorites.forEach(favorit => {
      favoritCat.tags.push(new Hashtag(favorit.title));
    });
    this.categories.unshift(favoritCat);
  }

  public onScroll(
    event: ScrollEventData,
    scrollView: ScrollView,
    topView: View
  ): void {
    this.currentScrollingY = scrollView.verticalOffset;
    if (isIOS) {
      return;
    }
    if (scrollView.verticalOffset <= this.parallaxHeight) {
      const offset = scrollView.verticalOffset / 2;
      if (scrollView.ios) {
        topView.animate({ translate: { x: 0, y: offset }, duration: 200 });
      } else {
        topView.translateY = Math.floor(offset);
      }
    }
  }

  public toggleHashtag(title: string): void {
    const index = this.selectedHashtags.indexOf(title);
    if (index > -1) {
      this.selectedHashtags.splice(index, 1);
    } else {
      this.selectedHashtags.push(title);
      this.hasAnyInteraction = true;
    }
    this.saveSelection();
    this.hashtagsChanged.emit();
    this.setExcludedHashtags();
  }

  public deselectHashtag(title: string): void {
    const index = this.selectedHashtags.indexOf(title);
    if (index > -1) {
      this.selectedHashtags.splice(index, 1);
    }
    this.saveSelection();
  }

  public selectAll(category: HashtagCategory): void {
    category.tags.forEach((hashtag) => {
      if (!this.isHashtagSelected(hashtag.title)) {
        this.selectHashtag(hashtag.title);
      }
    });
    this.saveSelection();
    this.setExcludedHashtags();
  }

  public deselectAll(category: HashtagCategory): void {
    category.tags.forEach((tag) => {
      this.deselectHashtag(tag.title);
    });
    this.saveSelection();
  }

  public areAllHashtagSelected(category: HashtagCategory): boolean {
    for (let i = 0; i < category.tags.length; i++) {
      if (!this.isHashtagSelected(category.tags[i].title)) {
        return false;
      }
    }
    return true;
  }

  public addHashtag(hashtag: Hashtag): void {
    const exist = this.isHashtagSelected(hashtag.title);
    if (exist) {
      this.deselectHashtag(hashtag.title);
    }
    this.selectHashtag(hashtag.title);
    this.saveSelection();
    this.setExcludedHashtags();
  }

  public redirectToHome(): void {
    this.router.navigate(['/home'], {
      transition: {
        name: 'slideRight',
        duration: 500,
        curve: 'easeOut'
      }
    });
    if (this.hasAnyInteraction) {
      this.userService.openFeedbackModal.emit();
    }
  }

  public navigateToLeaveFeedbackPage(): void {
    this.router.navigate([`/home/leavefeedback/${this.photo.id}`], {
      transition: {
        name: 'slideLeft',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public copyToClipboard(): void {
    this.showModal();
    this.hasAnyInteraction = true;
  }

  public dismissSoftKeyboard(): void {
    if (isIOS) {
      frame.Frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      utils.ad.dismissSoftInput();
    }
  }

  public getRecommendedAmount(title: string): number {
    switch (title) {
      case 'results_category_niche_hashtags':
        return 5;
      case 'results_category_generic_hashtags':
        return 15;
      default:
        return 0;
    }
  }

  public clickCensoredHashtag(): void {
      new Toasty({ text: localize('toast_hashtags_hidden') })
        .setToastDuration(ToastDuration.LONG)
        .show();
  }

  private selectHashtag(title: string): void {
    this.selectedHashtags.push(title);
    this.hasAnyInteraction = true;
  }

  private isHashtagSelected(title: string): boolean {
    return this.selectedHashtags.indexOf(title) > -1;
  }

  private showModal(): void {
    const okFunc = () => {
      setTimeout.bind(this)(() => {
        this.navigateToLeaveFeedbackPage();
      }, 100);
    };
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        icon: 'copied',
        buttonOk: 'results_ok_to_leave_feedback',
        headline: 'copy_successful',
        desc: 'copy_please_give_feedback',
        okFunc: okFunc
      }
    };
    this.modalService.showModal(ModalComponent, options);
  }

  private saveSelection(): void {
    const selectedHashtags: Hashtag[] = [];
    for (let i = 0; i < this.selectedHashtags.length; i++) {
      selectedHashtags.push(new Hashtag(this.selectedHashtags[i]));
    }
    this.photo.selectedHashtags = selectedHashtags;
    this.userService.updatePhoto(this.photo);
  }

  private setExcludedHashtags(): void {
    this.excludedHashtags = [];
    this.categories.forEach(category => {
      category.tags.forEach(tag => {
        this.excludedHashtags.push(tag.title);
      });
    });
  }

}
