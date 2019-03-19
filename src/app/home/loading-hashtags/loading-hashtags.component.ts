import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";
import { UserStorageService } from '~/app/storages/user-storage.service';
import { DeviceService } from '~/app/services/device-photos.service';
import { Photo } from '~/app/models/photo';
import { isIOS, isAndroid } from "platform";

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.css'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit {

  public loading = "~/app/assets/loading.html";
  private countDots: number = 0;

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userStorageService: UserStorageService,
    private deviceService: DeviceService
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {  

    var image = this.deviceService.getSelectedPhoto();
    var photo = new Photo();
    
    var photoPath = isIOS ? image.ios : image.android;
    photo.image = photoPath;

    this.userStorageService.setPhoto(photo);
    
    setTimeout (() => { 
      this.requestFinished();
     }, 6000);

     this.animateDots();
  }

  private requestFinished(): void {

    this.router.navigate(["/home/results/1"], {
      transition: {
        name: "FadeIn",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  random(min = 50, max = 150) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  animateDots() {
    var that = this;
    setInterval(() => {
      that.countDots = that.countDots >= 3 ? 0 : that.countDots + 1;
    }, 600);
  }

}
