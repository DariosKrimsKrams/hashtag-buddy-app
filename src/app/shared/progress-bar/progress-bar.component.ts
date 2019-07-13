import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PhotosCountService } from '../../storages/photos-count.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { localize } from 'nativescript-localize/angular';

@Component({
  selector: 'ProgressBar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
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

  @Input() page: string;
  @Input() width: string;
  @Input() forceFreeMode: boolean;

  private oneHour = 3600;
  private photosCountChangeSubscription: Subscription;

  constructor(
    private readonly photosCountService: PhotosCountService
  ) { }

  ngOnInit() {
    this.photosCountChangeSubscription = this.photosCountService.changedAmount.subscribe(() => {
      this.updateFreeIndicator();
      this.buildText();
      this.buildData();
    });
    
    this.updateFreeIndicator();
    this.buildText();
    this.buildData();
  }

  ngOnDestroy() {
    this.photosCountChangeSubscription.unsubscribe();
  }

  private updateFreeIndicator(): void {
    this.countPhotoLeft = this.photosCountService.getTotalCount();
    if (this.forceFreeMode) {
      this.countPhotoLeft = 0;
    }
    this.countPhotosOverall = environment.freePhotosStart;
    if (this.countPhotoLeft === 0) {
      this.timeOverall = environment.freePhotosIncreatingTime;
    }
  }

  private buildText(): void {

    let hasPayedPhotos = this.photosCountService.hasPayedPhotos();

    if (hasPayedPhotos && this.page !== 'home') {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
    if (this.page === 'home') {
      let textKey = hasPayedPhotos ? 'progressbar_home_iapmode' : 'progressbar_home_promode';
      this.text1 = localize(textKey, this.countPhotoLeft.toString());
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
    let result = this.calcTimes();

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

  setProgressbarWidth(percent: number) {
    if (percent < 2) {
      percent = 2;
    }
    this.columns = percent + '*,' + (100 - percent) + '*';
  }

  setUI(hour: number, min: number, sec: number) {
    let h = '', m = '', s = '';
    if (hour < 10) { h = '0'; }
    if (min < 10) { m = '0'; }
    if (sec < 10) { s = '0'; }
    let timeAsText = h + hour + ':' + m + min + ':' + s + sec;
    return localize('progressbar_freemode_time', timeAsText);

  }

  private calcTimes(): {hour: number, min: number, sec: number} {
    let date = this.photosCountService.getDate();
    this.timeStart = (Date.now() / 1000 | 0) - date;
    let hour = Math.floor((this.timeOverall - this.timeStart) / this.oneHour);
    let min = Math.floor((this.timeOverall - this.timeStart - hour * this.oneHour) / 60);
    let sec = (this.timeOverall - this.timeStart) % 60;
    return {hour: hour, min: min, sec: sec};
  }

  private updateTimer(percent: number) {
    let intervalId = setInterval(() => {
      this.setProgressbarWidth(percent);
      percent += 1 / this.timeOverall * 100;
      if (percent >= 100) {
        clearInterval(intervalId);
      }

      let result = this.calcTimes();
      let hour = result.hour;
      let min = result.min;
      let sec = result.sec;
      this.text4 = this.setUI(hour, min, sec);
      
    }, 1000);
  }

}
