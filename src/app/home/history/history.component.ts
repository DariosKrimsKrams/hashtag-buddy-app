import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Photo } from "~/app/models/photo";
import { UserService } from "../../storages/user.service";
import { RouterExtensions } from "nativescript-angular/router";
import { Hashtag } from "~/app/models/hashtag";

@Component({
  selector: "ns-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {

  selected: number = -1;
  photos: Photo[] = [];
  hashtagAmount = 7;

  @Input() isHistoryOpen: boolean;
  @Output() openCloseHistory = new EventEmitter();

  constructor(
    private userService: UserService,
    private router: RouterExtensions,
    private cd: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.photos = this.userService.getPhotos();
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

  public deleteHistoryItem(): void {
    if(this.selected == -1) {
      return;
    }
    var successful = this.userService.deletePhoto(this.photos[this.selected]);
    // ToDo remove image from disk
    // this.photos = this.userService.getPhotos();
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
  }

  public selectElement(photo: Photo): void {
    var id = photo.id;
    this.router.navigate([`/home/results/${id}`], {
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
