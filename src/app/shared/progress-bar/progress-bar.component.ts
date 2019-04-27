import { Component, Input, OnInit, OnDestroy} from "@angular/core";
import { PhotosCountService } from "../../storages/photos-count.service";
import { environment } from "../../environments/environment";
import { Subscription } from "rxjs";

@Component({
  selector: 'ProgressBar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  moduleId: module.id,
})
export class ProgressBarComponent implements OnInit, OnDestroy {

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
  @Input() onlyFreeMode: boolean;

  private oneHour = 3600;
  private photosCountChangeSubscription: Subscription;

  constructor(
    private readonly photosCountService: PhotosCountService
  ) { }

  ngOnInit() {
    this.photosCountChangeSubscription = this.photosCountService.changedData.subscribe(() => {
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
    this.countPhotoLeft = this.photosCountService.getCount();
    this.countPhotosOverall = environment.freePhotosStart;
    if(this.countPhotoLeft == 0) {
      // var date = this.photosCountService.getDate();
      // this.timeStart = (Date.now() / 1000 | 0) - date;
      this.timeOverall = environment.freePhotosIncreatingTime;
    }
  }

  private buildText(): void {

    if(this.page === "home") {
      this.text1 = this.countPhotoLeft + " photos left";
      this.text2 = "Free mode: Some hashtags will be hidden.";
    }

    if(this.page === "confirm") {
      this.text1 = this.countPhotoLeft + " photos left: Get the best hashtags";
      this.text2 = "Free limit reached:";
      this.text3 = "Best hashtags are hidden now :(";
    }

    if(this.page === "results") {
      this.text1 = "";
      this.text2 = "Free limit reached: Best hashtags are hidden.";
      this.text3 = "Enjoy Instaq Pro to unlock all hashtags.";
    }
  }


  private buildData(): void {
    let percent = 0;
    var result = this.calcTimes();

    this.text4 = this.setUI(result.hour, result.min, result.sec);

    if(this.countPhotoLeft > 0) {
      percent = this.countPhotoLeft / this.countPhotosOverall * 100;
      this.setProgressbarWidth(percent);
    } else if(this.page === "home") {
      percent = this.timeStart / this.timeOverall * 100;
      this.setProgressbarWidth(percent);
      this.updateTimer(percent);
    }    
  }

  setProgressbarWidth(percent: number) {
    if(percent < 2) {
      percent = 2
    }
    this.columns = percent + "*," + (100 - percent) + "*";
  }

  setUI(hour: number, min: number, sec: number) {
    let h = "", m = "", s = "";
    if(hour < 10) { h = "0"; }
    if(min < 10) { m = "0"; }
    if(sec < 10) { s = "0"; }
    return ("In " + h + hour + ":" + m + min + ":" + s + sec + " you receive 1 uncensored Upload.");
  }

  private calcTimes(): {hour: number, min: number, sec: number} {
    var date = this.photosCountService.getDate();
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

      var result = this.calcTimes();
      let hour = result.hour;
      let min = result.min;
      let sec = result.sec;
      this.text4 = this.setUI(hour, min, sec);
      
    }, 1000);
  }

}
