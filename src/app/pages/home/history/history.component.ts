import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Photo } from '~/app/models/photo';
import { UserService } from '../../../storages/user.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { Hashtag } from '~/app/models/hashtag';
import { DeviceService } from '~/app/services/device-photos.service';
import { Subscription } from 'rxjs';
import { ToastDuration, Toasty } from 'nativescript-toasty';
import { localize } from 'nativescript-localize/angular';
import { isIOS } from 'tns-core-modules/platform';
import { ScrollView } from 'tns-core-modules/ui/scroll-view/scroll-view';

@Component({
  selector: 'ns-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit, OnDestroy {

  public selected: number = -1;
  public photosReverse: Photo[] = [];
  public isHistoryOpen: boolean;
  public isIOS: boolean;
  public isOpened: boolean = false;

  private hashtagAmount: number = 7;
  private photoAddedSubscription: Subscription;
  private photoUpdatedSubscription: Subscription;
  private historyOpenChangedSubscription: Subscription;

  @Input() public historyOpenChanged: EventEmitter<boolean>;
  @Input() public showHeader: boolean;
  @Output() public openCloseHistory = new EventEmitter();
  @ViewChild('scrollView', { read: ElementRef, static: false }) public scrollView: ElementRef;

  constructor(
    private readonly userService: UserService,
    private readonly router: RouterExtensions,
    private readonly deviceService: DeviceService,
    private readonly cd: ChangeDetectorRef
  ) {
    this.isIOS = isIOS;
    this.cd.detach();
  }

  public ngOnInit(): void {
    this.setPhotos(this.userService.getPhotos());
    this.photoAddedSubscription = this.userService.photoAdded.subscribe(
      (photos: Photo[]) => {
        this.setPhotos(photos);
      }
    );
    this.photoUpdatedSubscription = this.userService.photoUpdated.subscribe(
      (photos: Photo[]) => {
        this.setPhotos(photos);
      }
    );
    if (!!this.historyOpenChanged) {
      this.historyOpenChangedSubscription = this.historyOpenChanged.subscribe(
        (status) => {
          this.isHistoryOpen = status;
          this.cd.detectChanges();
        }
      );
    }
    this.cd.detectChanges();
    setTimeout.bind(this)(() => {
      this.allowScrolling(false);
    }, 1000);
  }

  public ngOnDestroy(): void {
    if (!!this.photoAddedSubscription) {
      this.photoAddedSubscription.unsubscribe();
    }
    if (!!this.photoUpdatedSubscription) {
      this.photoUpdatedSubscription.unsubscribe();
    }
    if (!!this.historyOpenChangedSubscription) {
      this.historyOpenChangedSubscription.unsubscribe();
    }
  }

  public selectItem(index: number): void {
    if (index === this.selected) {
      this.selected = -1;
    } else {
      this.selected = index;
    }
  }

  public isSelected(index: number): boolean {
    return index === this.selected;
  }

  public deleteHistoryItem(photo): void {
    if (this.selected === -1) {
      return;
    }
    const successful = this.userService.deletePhoto(photo);
    this.deviceService.deletePhoto(photo.image);
    let toastText = '';
    if (successful) {
      this.photosReverse.splice(this.selected, 1);
      this.selected = -1;
      toastText = 'toast_delete_successful';
    } else {
      toastText = 'toast_delete_failed';
    }
    new Toasty({ text: localize(toastText) })
      .setToastDuration(ToastDuration.LONG)
      .show();
  }

  public clickOpenCloseHistory(): void {
    this.openCloseHistory.emit();
    this.setPhotos(this.userService.getPhotos());
    this.isOpened = !this.isOpened;
    this.allowScrolling(this.isOpened);
    if (!this.isOpened) {
      this.allowToTop();
    }
  }

  public selectElement(photo: Photo): void {
    if (photo.categories.length === 0) {
      return;
    }
    this.router.navigate([`/home/results/${photo.id}`], {
      transition: {
        name: 'FadeIn',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public getHashtags(photo: Photo): Hashtag[] {
    const count = this.hashtagAmount;
    const hashtags: Hashtag[] = [];
    if (
      photo.selectedHashtags !== undefined &&
      photo.selectedHashtags.length !== 0
    ) {
      const selectedAmount =
        photo.selectedHashtags.length >= count
          ? count
          : photo.selectedHashtags.length;
      for (let i = 0; i < selectedAmount; i++) {
        hashtags.push(photo.selectedHashtags[i]);
      }
    }
    if (photo.categories !== undefined && photo.categories.length !== 0) {
      let categoriesAmount =
        photo.categories[0].tags.length >= count - hashtags.length
          ? count - hashtags.length
          : photo.categories[0].tags.length;
      for (let i = 0; i < categoriesAmount; i++) {
        const tag = photo.categories[0].tags[i];
        if (tag.isCensored) {
          if (categoriesAmount + 1 < photo.categories[0].tags.length - 1) {
            categoriesAmount++;
          }
        } else {
          hashtags.push(tag);
        }
      }
    }
    return hashtags;
  }

  public countFurtherHashtags(photo: Photo): number {
    if (photo.categories === undefined) {
      return 0;
    }
    let amount = 0;
    for (let i = 0; i < photo.categories.length; i++) {
      const category = photo.categories[i];
      amount += category.tags.length;
    }
    const count = this.hashtagAmount;
    const result = amount - count;
    return result >= 0 ? result : 0;
  }

  private setPhotos(photos: Photo[]): void {
    this.photosReverse = photos.slice().reverse();
    this.cd.detectChanges();
  }

  private allowScrolling(status: boolean): void {
    const scrollView: ScrollView = this.scrollView.nativeElement;
    if (isIOS) {
      scrollView.ios.scrollEnabled = !status;
    } else {
      if (!!scrollView.android) {
        scrollView.android.setScrollEnabled(status);
      }
    }
  }

  private allowToTop(): void {
    setTimeout.bind(this)(() => {
      this.scrollView.nativeElement.scrollToVerticalOffset(0, false);
    }, 1);
  }

}
