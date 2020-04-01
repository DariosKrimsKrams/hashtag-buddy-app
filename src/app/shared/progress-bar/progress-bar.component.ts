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
  @Input() public width: string;

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
    this.photosCountChangeSubscription.unsubscribe();
    this.appRatedSubscription.unsubscribe();
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
    if (hasPayedPhotos && this.page !== 'home') {
      return;
    }

    if (this.page === 'home') {
      if (hasPayedPhotos) {
        this.text1 = localize('progressbar_home_iapmode', this.usedAmount.toString(), this.countPhotosOverall.toString());
      } else {
        if (this.countPhotoLeft === 0) {
          this.text1 = localize('progressbar_home_freemode', this.usedAmount.toString(), this.countPhotosOverall.toString());
        } else if (this.used) {
          this.text1 = localize('progressbar_home_startmode_is_using', this.usedAmount.toString(), this.countPhotosOverall.toString());
        } else {
          this.text1 = localize('progressbar_home_startmode_not_used', this.countPhotosOverall.toString());
        }
      }
    }

    if (this.page === 'confirm') {
      this.text1 = '';
      if (this.used) {
        this.text1 = localize('progressbar_home_iapmode', this.usedAmount.toString(), this.countPhotosOverall.toString());
        if (this.countPhotoLeft === 0) {
          this.text1 = localize('progressbar_confirm_freemode1');
        }
      }
    }

    if (this.page === 'results') {
      this.text1 = '';
      if (this.countPhotoLeft === 0) {
        this.text1 = localize('progressbar_results_freemode1');
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
