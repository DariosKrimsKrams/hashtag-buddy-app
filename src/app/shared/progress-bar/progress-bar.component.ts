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
      var date = this.photosCountService.getDate();
      var dateNow = Date.now() / 1000 | 0;
      this.timeStart = dateNow - date;
      this.timeOverall = environment.freePhotosIncreatingTime;
    }
  }

  private buildText(): void {

    if(this.page === "home") {
      this.text1 = this.countPhotoLeft + " unlocked photos left";
      this.text2 = "Free mode: Some hashtags are censored.";
    }

    if(this.page === "confirm") {
      this.text1 = this.countPhotoLeft + " unlocked photos left";
      this.text2 = "Free limit reached: Best hashtags are hidden now.";
      this.text3 = "But don't worry: Enjoy Instaq Pro for best results.";
    }

    if(this.page === "results") {
      this.text1 = "Instaq Free: " + this.countPhotoLeft + " of " + this.countPhotosOverall + " photos left with full potential.";
      this.text2 = "Free limit reached: Best hashtags are hidden.";
      this.text3 = "Use Instaq Pro to unlock the full potential.";
    }
  }


  private buildData(): void {
    let percent = 0;
    let hour = (this.timeOverall - this.timeStart) / this.oneHour;
    let min = (this.timeOverall - this.timeStart - hour * this.oneHour) / 60;
    let sec = this.timeOverall - this.timeStart - hour * this.oneHour - min * 60;

    this.text4 = this.setTimer(hour, min, sec);

    if(this.countPhotoLeft > 0) {
      percent = this.countPhotoLeft / this.countPhotosOverall * 100;
      this.setProgressbarWidth(percent);
    } else if(this.page === "home") {
      this.columns = this.timeStart / this.timeOverall * 100;
      percent = this.columns;
      this.setProgressbarWidth(percent);
      this.updateTimer(percent);
    }    
  }

  setProgressbarWidth(percent: number) {
    this.columns = percent + "*," + (100 - percent) + "*";
  }

  setTimer(hour: number, min: number, sec: number) {
    let h = "0", m = "0", s = "0";
    if(hour < 10) {
      h += hour;
    } else {
      h = hour.toString();
    }

    if(min < 10) {
      m += min;
    } else {
      m = min.toString();
    }

    if(sec < 10) {
      s += sec;
    } else {
      s = sec.toString();
    }

    return ("In " + h + ":" + m + ":" + s + " yout receive an unlocked photo.");
  }

  private updateTimer(percent: number) {

    let hour = (this.timeOverall - this.timeStart) / this.oneHour;
    let min = (this.timeOverall - this.timeStart - hour * this.oneHour) / 60;
    let sec = this.timeOverall - this.timeStart - hour * this.oneHour - min * 60;
    
    let intervalId = setInterval(() => {
      this.setProgressbarWidth(percent);
      percent += 1 / this.timeOverall * 100;
      if (percent >= 100) {
        clearInterval(intervalId);
      }
      if(sec == 0) {
        if(min > 0) {
          min--;
          sec = 59;
        } else {
          if(hour > 0) {
            hour--;
            min = 59;
            sec = 59;
          } else {
            hour = 0; min = 0; sec = 0;
            this.text4 = this.setTimer(hour, min, sec);
            clearInterval(intervalId);
          }
        }
      } else {
        sec--;
        this.text4 = this.setTimer(hour, min, sec);
      }
    }, 1000);
  }

}
