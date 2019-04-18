import { Component, Input} from "@angular/core";
import { PhotosCountService } from "../../storages/photos-count.service";
import { environment } from "../../environments/environment";

@Component({
  selector: 'ProgressBar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  moduleId: module.id,
})
export class ProgressBarComponent {

  columns;
  text1;
  text2;
  text3;
  text4;
  text5;
  @Input() page: string;
  @Input() width: string;
  countPhotoLeft: number;
  countPhotosOverall: number;
  timeStart: number;
  timeOverall: number;

  constructor(
    private readonly photosCountService: PhotosCountService
  ) { }

  ngOnInit() {

    this.updateFreeIndicator();

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
    
    let percent = 0;
    let hour = (this.timeOverall - this.timeStart) / 3600;
    let min = (this.timeOverall - this.timeStart - hour*3600) / 60;
    let sec = this.timeOverall - this.timeStart - hour*3600 - min*60;

    this.text4 = this.setTimer(hour, min, sec);

    if(this.countPhotoLeft > 0) {
      percent = this.countPhotoLeft / this.countPhotosOverall * 100;
      this.setProgressbarWidth(percent);
    } else if(this.page === "home") {
      this.columns = this.timeStart / 86400 * 100;
      percent = this.columns;
      this.setProgressbarWidth(percent);
      let intervalId = setInterval(() => {
        this.setProgressbarWidth(percent);
        percent += 1/86400 * 100;
        if (percent > 100) {
          clearInterval(intervalId);
        }
        if(sec == 0) {
          if(min > 0) {
            min--;
            sec = 59;
          }else {
            if(hour > 0) {
              hour--;
              min = 59;
              sec = 59;
            }else {
              hour = 0; min = 0; sec = 0;
              this.text4 = this.setTimer(hour, min, sec);
              clearInterval(intervalId);
            }
          }
        }else {
          sec--;
          this.text4 = this.setTimer(hour, min, sec);
        }
      }, 1000);
    }    
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

  setProgressbarWidth(percent) {
    this.columns = percent + "*," + (100 - percent) + "*";
  }

  setTimer(hour, min, sec) {
    let h = "0", m = "0", s = "0";
    if(hour < 10) {
      h += hour;
    } else {
      h = hour;
    }

    if(min < 10) {
      m += min;
    } else {
      m = min;
    }

    if(sec < 10) {
      s += sec;
    } else {
      s = sec;
    }

    return ("In " + h + ":" + m + ":" + s + " yout receive an unlocked photo.");
  }
}
