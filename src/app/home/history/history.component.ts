import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Photo } from "~/app/models/photo";
import { UserService } from "../../storages/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Hashtag } from "~/app/models/hashtag";
import { DeviceService } from "~/app/services/device-photos.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id,
})
export class HistoryComponent implements OnInit, OnDestroy {

  public selected: number = -1;
  public photos: Photo[] = [];
  public hashtagAmount = 7;

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
    this.photos = this.userService.getPhotos();
    this.photoAddedSubscription = this.userService.photoAdded.subscribe((photos) => {
      this.photos = photos;
    });
    this.photos = this.userService.getPhotos();
    this.photoUpdatedSubscription = this.userService.photoUpdated.subscribe((photos) => {
      this.photos = photos;
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
      this.photos.splice(this.selected, 1);
      this.selected = -1;
      // ToDo show toast "delete successful"
    } else {
      // ToDo show toast "delete failed"
    }
  }

  public clickOpenCloseHistory(): void {
    this.openCloseHistory.emit();
    this.photos = this.userService.getPhotos();
  }

  public selectElement(photo: Photo): void {
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
				hashtags.push(photo.categories[0].tags[i]);
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

}