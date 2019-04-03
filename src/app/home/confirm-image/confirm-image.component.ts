import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { DeviceService } from '~/app/services/device-photos.service';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { Page } from 'tns-core-modules/ui/page/page';
import { Observable, of } from 'rxjs';
import * as imagepicker from "nativescript-imagepicker";
import { Evaluation } from '~/app/models/evaluation';
import { UserService } from '../../storages/user.service';
import { isIOS, isAndroid } from "platform";
import { Photo } from '~/app/models/photo';
import { HashtagCategory } from '~/app/models/hashtag-category';
import { HASHTAGS } from '../data/hashtags';
import { ImageSource, fromFile, fromAsset } from "tns-core-modules/image-source";
import { knownFolders, path } from 'tns-core-modules/file-system/file-system';
import { EvaluationRepository } from '~/app/services/evaluation-repository.service';

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

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private deviceService: DeviceService,
    private userService: UserService,
    private evaluationRepository: EvaluationRepository
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
    
    this.openLoadingPage();
    this.savePhoto().subscribe(photoId => {

      var customerId = this.userService.getUserId();
      console.log("customerId = ", customerId);
      var photo = this.userService.getPhoto(photoId);

      // ToDo do Request
      this.evaluationRepository.UploadPhoto(photo.image, customerId)
      .subscribe(x => {
        // ...
        console.log("UploadPhoto-> ", x);
      });
      
      var that = this;
      setTimeout(() => {
        photo.categories = HASHTAGS;
        that.userService.updatePhoto(photo);
        that.openResultsPage(photoId);
      }, 1000);
    });
    
  }

  private savePhoto(): Observable<number> {
    return new Observable<number>(observer => {
      var photo = new Photo();
      photo.timestamp = new Date().getTime();
      // var image = this.deviceService.getSelectedPhoto();
      this.storePhoto(this.photo).subscribe(path => {
        photo.image = path;
        var photoId = this.userService.addPhoto(photo);
        observer.next(photoId);
        observer.complete();
      })
    });
  }

  private storePhoto(image: ImageAsset): Observable<string> {
    return new Observable<string>(observer => {
      fromAsset(image).then(imageSource => {
        var targetFilename = 'img_' + new Date().getTime() + '.jpg';
        const tempPath = knownFolders.documents().path;
        const localFullPath = path.join(tempPath, targetFilename);
        var saved = imageSource.saveToFile(localFullPath, "jpg");
        observer.next(localFullPath);
        observer.complete();
      });
    });
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

  private openLoadingPage(): void {
    this.router.navigate([`/home/loading-hashtags`], {
      transition: {
        name: "FadeIn",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  private openResultsPage(id: number): void {

    this.router.navigate([`/home/results/${id}`], {
      transition: {
        name: "FadeIn",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

}
