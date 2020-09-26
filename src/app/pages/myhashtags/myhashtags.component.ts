import { Component, OnInit } from '@angular/core';
import { Hashtag } from '~/app/models/hashtag';
import { MyHashtag } from '~/app/models/my-hashtag';
import { UserService } from '~/app/storages/user.service';
import { Photo } from '~/app/models/photo';
import { disableIosSwipe } from '~/app/shared/status-bar-util';
import { RouterExtensions } from '@nativescript/angular';
import { isAndroid, isIOS, Page, Frame, Utils } from '@nativescript/core';

@Component({
  selector: 'ns-myhashtags',
  templateUrl: './myhashtags.component.html',
  styleUrls: ['./myhashtags.component.scss'],
  moduleId: module.id
})
export class MyhashtagsComponent implements OnInit {

  public hashtagsOwn: MyHashtag[] = [];
  public hashtagsGenerated: Hashtag[] = [];
  public headerHeight: number = 0;
  public headerTop: number = 0;
  public isIOS: boolean;

  constructor(
    private readonly page: Page,
    private readonly router: RouterExtensions,
    private readonly userService: UserService
  ) {
    this.page.actionBarHidden = true;
    this.isIOS = isIOS;
    disableIosSwipe(this.page);
    this.calcHeader();
  }

  public ngOnInit(): void {
    this.loadOwnHashtags();
    this.loadPhotoHashtags();
  }

  private loadOwnHashtags(): void {
    const favorites = this.userService.getFavorites();
    favorites.forEach(favorite => {
      this.hashtagsOwn.push(favorite);
    });
  }

  private loadPhotoHashtags(): void {
    const photos = this.userService.getPhotos();
    photos.forEach(photo => {
      photo.selectedHashtags.forEach(tag => {
        if (Photo.isHashtagPartOfAnyCategory(photo, tag.title)) {
          this.hashtagsGenerated.push(tag);
        }
      });
    });
  }

  public goPrevPage(): void {
    if (this.router.canGoBack()) {
      this.router.back();
    }
  }

  public dismissSoftKeyboard(): void {
    if (isIOS) {
      Frame.topmost().nativeView.endEditing(true);
    }
    if (isAndroid) {
      Utils.ad.dismissSoftInput();
    }
  }

  public addHashtag(hashtag: Hashtag): void {
    const exist =
      this.hashtagsOwn.filter(
        x => x.title.toLowerCase() === hashtag.title.toLowerCase()
      )[0] !== undefined;
    if (exist) {
      const index = this.hashtagsOwn
        .map(x => x.title.toLowerCase() === hashtag.title.toLowerCase())
        .indexOf(true);
      this.hashtagsOwn.splice(index, 1);
    }
    this.hashtagsOwn.unshift(new MyHashtag(hashtag.title, 1, 'own'));
    this.userService.setFavorites(this.hashtagsOwn);
  }

  private calcHeader(): void {
    const data = this.userService.calcHeader(1080, 416, 140);
    this.headerHeight = data.height;
    this.headerTop = data.top;
  }

}
