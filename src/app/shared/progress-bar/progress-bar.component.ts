import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PhotosCountService } from '../../storages/photos-count.service';
import { Subscription } from 'rxjs';
import { localize } from 'nativescript-localize/angular';
import { UserService } from '~/app/storages/user.service';

@Component({
  selector: 'ProgressBar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  moduleId: module.id,
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  public columns: any;
  public text1: string;
  public countPhotoLeft: number;
  public countPhotosOverall: number;
  public used: boolean;
  public usedAmount: number;

  @Input() public page: string;

  private photosCountChangeSubscription: Subscription;
  private appRatedSubscription: Subscription;

  constructor(
    private readonly photosCountService: PhotosCountService,
    private readonly userService: UserService
  ) { }

  public ngOnInit(): void {
    this.photosCountChangeSubscription = this.photosCountService.changedAmount.subscribe(() => {
      this.photoChanged();
    });
    this.appRatedSubscription = this.userService.appRatedTriggered.subscribe(() => {
      this.photoChanged();
    });
    this.photoChanged();
  }

  public ngOnDestroy(): void {
    if (!!this.photosCountChangeSubscription) {
      this.photosCountChangeSubscription.unsubscribe();
    }
    if (!!this.appRatedSubscription) {
      this.appRatedSubscription.unsubscribe();
    }
  }

  private photoChanged(): void {
    this.updateFreeIndicator();
    this.calcUsed();
    this.buildText();
    this.buildData();
  }

  private updateFreeIndicator(): void {
    this.countPhotosOverall = this.photosCountService.getTotalCount();
    this.countPhotoLeft = this.photosCountService.getRemainingCount();
    this.used = this.countPhotosOverall !== this.countPhotoLeft;
    this.usedAmount = this.countPhotosOverall - this.countPhotoLeft;
  }

  private buildText(): void {
    const hasPayedPhotos = this.photosCountService.hasPayedPhotos();
    this.text1 = '';

    if (this.page === 'confirm') {
      if (this.used) {
        if (hasPayedPhotos) {
          this.text1 = localize('progressbar_confirm_iapmode', this.countPhotosOverall.toString());
        } else {
          this.text1 = localize('progressbar_confirm_freemode');
        }
      }
    } else if (this.page === 'results') {
      if (this.countPhotoLeft === 0 && !hasPayedPhotos) {
        this.text1 = localize('progressbar_results_freemode');
      }
    }
  }

  private buildData(): void {
    let percent = (1 - (this.countPhotoLeft / this.countPhotosOverall)) * 100;
    if (percent < 3) {
      percent = 3;
    }
    this.columns = percent + '*,' + (100 - percent) + '*';
  }

  private calcUsed(): void {
    this.used = this.countPhotoLeft !== this.countPhotosOverall;
  }

}
