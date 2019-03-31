import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { DeviceService } from '~/app/services/device-photos.service';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { Page } from 'tns-core-modules/ui/page/page';
import * as imagepicker from "nativescript-imagepicker";
import { Evaluation } from '~/app/models/evaluation';
import { UserService } from '../../storages/user.service';
import { isIOS, isAndroid } from "platform";
import { Photo } from '~/app/models/photo';

@Component({
  selector: 'ns-confirm-image',
  templateUrl: './confirm-image.component.html',
  styleUrls: ['./confirm-image.component.css'],
  moduleId: module.id,
})
export class ConfirmImageComponent implements OnInit {

  photo: ImageAsset;
  width = "80%";
  page_name = "confirm";
  countPhotoLeft = 3;
  countPhotosOverall = 5;
  timeStart = 0;
  timeOverall = 0;
  // launched: boolean;

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private deviceService: DeviceService,
    private userService: UserService
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.loadImage();
  }

  loadImage(): void {
    this.photo = this.deviceService.getSelectedPhoto();
  }

  confirmImage(): void {
    // ToDo do Request
    var customerId = this.userService.getUserId();
    this.deviceService.UploadPhoto({customerId: customerId} as Evaluation)
    .subscribe(x => {
      // NOTHING happens
      // var photo = this.getPhoto();
      // var photoId = this.userService.setPhoto(photo);

      // this.launched = true;
      // this.goNextPage(photoId);
    });

    
    var photo = this.getPhoto();
    var photoId = this.userService.setPhoto(photo);
    // this.launched = true;
    this.goNextPage(photoId);
  }

  private getPhoto(): Photo {
    var photo = new Photo();
    var image = this.deviceService.getSelectedPhoto();
    var photoPath = isIOS ? image.ios : image.android;
    photo.image = photoPath;
    return photo;
  }

  chooseImage(): void {

    let that = this;

    let context = imagepicker.create({
      mode: "single",
      mediaType: imagepicker.ImagePickerMediaType.Image
    });
    
    context
      .authorize()
      .then(function() {
          return context.present();
      })
      .then(function(selection) {
        let imageSrc = selection[0];
        imageSrc.options.width = 1000;
        imageSrc.options.height = 1000;
        that.deviceService.setSelectedPhoto(imageSrc);
        that.photo = imageSrc;
      }).catch(function (e) {
        // process error
        console.log("IMAGE PICKER Failed: " + e);
      });
  }

  public goPrevPage(): void {
    this.router.navigate(["/home"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  private goNextPage(id: number): void {

    this.router.navigate([`/home/results/${id}`], {
      transition: {
        name: "FadeIn",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

}
