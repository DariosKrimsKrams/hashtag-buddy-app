import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Photo } from "~/app/models/photo";
import { UserService } from "../../storages/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Hashtag } from "~/app/models/hashtag";
import { DeviceService } from "~/app/services/device-photos.service";
import { Subscription } from "rxjs";
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id,
})
export class HistoryComponent implements OnInit, OnDestroy {

  public selected: number = -1;
  public photosReverse: Photo[] = [];
  private hashtagAmount = 7;
  private photoAddedSubscription: Subscription;
  private photoUpdatedSubscription: Subscription;
  
  @Input() isHistoryOpen: boolean;
  @Output() openCloseHistory = new EventEmitter();

  constructor(
    private readonly userService: UserService,
    private readonly router: RouterExtensions,
    private readonly deviceService: DeviceService,
  ) { }

  ngOnInit() {
    this.setPhotos(this.userService.getPhotos());
    this.photoAddedSubscription = this.userService.photoAdded.subscribe((photos: Photo[]) => {
      this.setPhotos(photos);
    });
    this.photoUpdatedSubscription = this.userService.photoUpdated.subscribe((photos: Photo[]) => {
      this.setPhotos(photos);
    });
  }
    
  ngOnDestroy() {
    this.photoAddedSubscription.unsubscribe();
    this.photoUpdatedSubscription.unsubscribe();
  }

  public selectItem(index: number): void {
    if(index == this.selected) {
      this.selected = -1;
    } else {
      this.selected = index;
    }
  }

  public isSelected(index: number): boolean {
    return index == this.selected;
  }

  public deleteHistoryItem(photo): void {
    if(this.selected == -1) {
      return;
    }
    var successful = this.userService.deletePhoto(photo);
    this.deviceService.deletePhoto(photo.image);
    if(successful) {
      this.photosReverse.splice(this.selected, 1);
      this.selected = -1;
      
      Toast.makeText(localize('toast_delete_successful')).show();
    } else {
      Toast.makeText(localize('toast_delete_failed')).show();
    }
  }

  public clickOpenCloseHistory(): void {
    this.openCloseHistory.emit();
    this.setPhotos(this.userService.getPhotos());
  }

  public selectElement(photo: Photo): void {
    if(photo.categories.length == 0) {
      return;
    }
    this.router.navigate([`/home/results/${photo.id}`], {
      transition: {
        name: "FadeIn",
        duration: 500,
        curve: "easeOut"
      }
    });
  }
	
	public getHashtags(photo: Photo): Hashtag[] {
    var count = this.hashtagAmount;
		var hashtags: Hashtag[] = [];
		if(photo.selectedHashtags !== undefined && photo.selectedHashtags.length !== 0) {
			var selectedAmount = photo.selectedHashtags.length >= count ? count : photo.selectedHashtags.length;
			for(let i = 0; i < selectedAmount; i++) {
				hashtags.push(photo.selectedHashtags[i]);
			}
		}
		if(photo.categories !== undefined && photo.categories.length !== 0) {
			var categoriesAmount = photo.categories[0].tags.length >= count - hashtags.length ? count - hashtags.length : photo.categories[0].tags.length;
			for(let i = 0; i < categoriesAmount; i++) {
        var tag = photo.categories[0].tags[i];
        if(tag.isCensored) {
          if(categoriesAmount+1 < photo.categories[0].tags.length-1) {
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
		if(photo.categories === undefined) {
			return 0;
		}
		var amount = 0;
		for(let i = 0; i < photo.categories.length; i++) {
			var category = photo.categories[i];
			amount += category.tags.length
		}
    var count = this.hashtagAmount;
    var result = amount - count;
		return result >= 0 ? result : 0;
  }

  private setPhotos(photos: Photo[]): void {
    this.photosReverse = photos.slice().reverse();
  }

}