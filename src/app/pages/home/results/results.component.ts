import { Component, OnInit, ViewContainerRef } from '@angular/core';
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
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/shared/modal/modal.component';
const clipboard = require('nativescript-clipboard');

@Component({
  selector: 'ns-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  moduleId: module.id
})
export class ResultsComponent implements OnInit {
  public parallaxHeight = 250;
  public photo: Photo;
  public highlightStatus: string[] = [];
  public currentScrollingY: number;
  public categories: HashtagCategory[] = [];

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly userService: UserService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly modalService: ModalDialogService,
    private readonly route: ActivatedRoute
  ) {
    this.page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.photo = this.userService.getPhoto(id);
    this.categories = Object.assign([], this.photo.categories);
    for (let i = 0; i < this.photo.selectedHashtags.length; i++) {
      this.selectHashtag(this.photo.selectedHashtags[i].title);
    }
    this.addFavoriteHashtags();
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
    if (this.isHashtagSelected(title)) {
      this.deselectHashtag(title);
    } else {
      this.selectHashtag(title);
    }
    this.saveSelection();
  }

  public deselectHashtag(title: string): void {
    for (let i = 0; i < this.highlightStatus.length; i++) {
      if (this.highlightStatus[i].toLowerCase() === title.toLowerCase()) {
        this.highlightStatus.splice(i, 1);
        return;
      }
    }
  }

  private selectHashtag(title: string): void {
    this.highlightStatus.push(title);
  }

  private isHashtagSelected(title: string): boolean {
    return this.highlightStatus.filter(x => x.toLowerCase() === title.toLowerCase())[0] !== undefined;
  }

  public selectAll(category: HashtagCategory): void {
    category.tags.map(hashtag => {
      if (!this.isHashtagSelected(hashtag.title)) {
        this.selectHashtag(hashtag.title);
      }
    });
    this.saveSelection();
  }

  public deselectAll(category: HashtagCategory): void {
    category.tags.map((tag) => { this.deselectHashtag(tag.title); });
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
  }

  public redirectToHome(): void {
    this.router.navigate(['/home'], {
      transition: {
        name: 'slideRight',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public copySelected(): void {
    if (this.showToastIfHasNoSelectedHashtags()) {
      return;
    }
    this.copyToClipboard();
  }

  private navigateToLeaveFeedbackPage(): void {
    this.router.navigate([`/home/leavefeedback/${this.photo.id}`], {
      transition: {
        name: 'slideLeft',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  private copyToClipboard(): void {
    const text = this.getHashtagsAsText();
    clipboard
      .setText(text)
      .then(() => {
        this.showModal();
      })
      .catch(function(): void {
        Toast.makeText(localize('copy_failed'), 'long').show();
      });
  }

  private showModal(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        autoCloseTime: 3000,
        showIcon: true,
        headline: 'copy_successful',
        desc: 'copy_please_give_feedback'
      }
    };
    this.modalService.showModal(ModalComponent, options).then(() => {
      this.navigateToLeaveFeedbackPage();
    });
  }

  private getHashtagsAsText(): string {
    let text = '';
    for (let i = 0; i < this.highlightStatus.length; i++) {
      text += `#${this.highlightStatus[i]} `;
    }
    return text;
  }

  private showToastIfHasNoSelectedHashtags(): boolean {
    const hasSelectedHashtags = this.highlightStatus.length > 0;
    if (!hasSelectedHashtags) {
      Toast.makeText(localize('toast_no_hashtags_selected')).show();
    }
    return !hasSelectedHashtags;
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
    switch (title) {
      case 'results_category_niche_hashtags':
        return 5;
      case 'results_category_generic_hashtags':
        return 15;
      default:
        return 0;
    }
  }

  private saveSelection(): void {
    const selectedHashtags: Hashtag[] = [];
    for (let i = 0; i < this.highlightStatus.length; i++) {
      selectedHashtags.push(new Hashtag(this.highlightStatus[i]));
    }
    this.photo.selectedHashtags = selectedHashtags;
    this.userService.updatePhoto(this.photo);
  }

  public clickedCensoredHashtag(): void {
    Toast.makeText(localize('toast_hashtags_hidden')).show();
  }
}
