import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PhotosCountService } from '../../storages/photos-count.service';
import { environment } from '../../environments/environment';
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

  public isVisible: boolean;
  public columns: any;
  public text1: string;
  public text2: string;
  public text3: string;
  public text4: string;
  public text5: string;
  public countPhotoLeft: number;
  public countPhotosOverall: number;
  public timeStart: number;
  public timeOverall: number;

  @Input() public page: string;
  @Input() public width: string;
  @Input() public forceFreeMode: boolean;

  private oneHour = 3600;
  private photosCountChangeSubscription: Subscription;
  private used: boolean;

  constructor(
    private readonly photosCountService: PhotosCountService,
    private readonly userService: UserService
  ) { }

  public ngOnInit(): void {
    this.photosCountChangeSubscription = this.photosCountService.changedAmount.subscribe(() => {
      this.photoChanged();
    });
    this.photoChanged();
  }

  public ngOnDestroy(): void {
    this.photosCountChangeSubscription.unsubscribe();
  }

  private photoChanged(): void {
    this.updateFreeIndicator();
    this.calcUsed();
    this.buildText();
    this.buildData();
  }

  private updateFreeIndicator(): void {
    this.countPhotoLeft = this.photosCountService.getTotalCount();
    if (this.forceFreeMode) {
      this.countPhotoLeft = 0;
    }
    this.countPhotosOverall = environment.freePhotosStart;
    const isAppRated = this.userService.isAppRated();
    if (isAppRated) {
      this.countPhotosOverall += environment.freePhotosRateApp;
    }

    if (this.countPhotoLeft === 0) {
      this.timeOverall = environment.freePhotosIncreatingTime;
    }
  }

  private buildText(): void {
    const hasPayedPhotos = this.photosCountService.hasPayedPhotos();
    if (hasPayedPhotos && this.page !== 'home') {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
    if (this.page === 'home') {
      const usedAmount = this.countPhotosOverall - this.countPhotoLeft;
      if (hasPayedPhotos) {
        this.text1 = localize('progressbar_home_iapmode', usedAmount.toString(), this.countPhotosOverall.toString());
      } else {
        if (this.used) {
          this.text1 = localize('progressbar_home_startmode_is_using', usedAmount.toString(), this.countPhotosOverall.toString());
        } else {
          this.text1 = localize('progressbar_home_startmode_not_used', this.countPhotosOverall.toString());
        }
      }
      this.text2 = localize('progressbar_home_freemode');
    }

    if (this.page === 'confirm') {
      this.text1 = localize('progressbar_confirm_promode', this.countPhotoLeft.toString());
      this.text2 = localize('progressbar_confirm_freemode1');
      this.text3 = localize('progressbar_confirm_freemode2');
    }

    if (this.page === 'results') {
      this.text2 = localize('progressbar_results_freemode1');
      this.text3 = localize('progressbar_results_freemode2');
    }
  }

  private buildData(): void {
    let percent = 0;
    const result = this.calcTimes();

    this.text4 = this.setUI(result.hour, result.min, result.sec);

    if (this.countPhotoLeft > 0) {
      percent = this.countPhotoLeft / this.countPhotosOverall * 100;
      this.setProgressbarWidth(percent);
    } else if (this.page === 'home') {
      percent = this.timeStart / this.timeOverall * 100;
      this.setProgressbarWidth(percent);
      this.updateTimer(percent);
    }
  }

  private setProgressbarWidth(percent: number): void {
    if (percent < 2) {
      percent = 2;
    }
    this.columns = percent + '*,' + (100 - percent) + '*';
  }

  private setUI(hour: number, min: number, sec: number): string {
    let h = '', m = '', s = '';
    if (hour < 10) { h = '0'; }
    if (min < 10) { m = '0'; }
    if (sec < 10) { s = '0'; }
    const timeAsText = h + hour + ':' + m + min + ':' + s + sec;
    return localize('progressbar_freemode_time', timeAsText);
  }

  private calcTimes(): {hour: number, min: number, sec: number} {
    const date = this.photosCountService.getDate();
    this.timeStart = (Date.now() / 1000 | 0) - date;
    const hour = Math.floor((this.timeOverall - this.timeStart) / this.oneHour);
    const min = Math.floor((this.timeOverall - this.timeStart - hour * this.oneHour) / 60);
    const sec = (this.timeOverall - this.timeStart) % 60;
    return {hour: hour, min: min, sec: sec};
  }

  private updateTimer(percent: number): void {
    const intervalId = setInterval(() => {
      this.setProgressbarWidth(percent);
      percent += 1 / this.timeOverall * 100;
      if (percent >= 100) {
        clearInterval(intervalId);
      }
      const result = this.calcTimes();
      const hour = result.hour;
      const min = result.min;
      const sec = result.sec;
      this.text4 = this.setUI(hour, min, sec);
    }, 1000);
  }

  private calcUsed(): void {
    this.used = this.countPhotoLeft !== this.countPhotosOverall;
  }

}
