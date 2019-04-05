import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { DeviceService } from '~/app/services/device-photos.service';
import { ImageAsset } from 'tns-core-modules/image-asset/image-asset';
import { Page } from 'tns-core-modules/ui/page/page';
import { Observable, of } from 'rxjs';
import * as imagepicker from "nativescript-imagepicker";
import { UserService } from '../../storages/user.service';
import { Photo } from '~/app/models/photo';
import { fromAsset } from "tns-core-modules/image-source";
import { knownFolders, path } from 'tns-core-modules/file-system/file-system';
import { EvaluationRepository } from '~/app/services/evaluation-repository.service';
import { HashtagCategory } from '../../models/hashtag-category';
import { Hashtag } from '../../models/hashtag';
import { IHttpResponse } from '~/app/models/request/http-response';

interface HashtagResult {
  name: string;
  refCount: number;
  posts: number;
}

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
      .subscribe((httpResponse: IHttpResponse) => {
        console.log(httpResponse);
        if(httpResponse.code == 200) {
          this.parseSuccessfulResponse(photoId, httpResponse);
        } else {
            // ToDo
        }
      });
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

  private parseSuccessfulResponse(photoId: number, httpResponse: IHttpResponse): void {
    var data = JSON.parse(httpResponse.message);
    console.log(data);
    var mostRelevantTags: HashtagResult[] = data.mostRelevantHTags;
    var trendingTags: HashtagResult[] = data.trendingHTags;
    var categories: HashtagCategory[] = [];
    categories.push(this.toHashtagCategory(mostRelevantTags, "results_category_generic_hashtags"));
    categories.push(this.toHashtagCategory(trendingTags, "results_category_niche_hashtags"));

    var photo = this.userService.getPhoto(photoId);
    photo.categories = categories;
    
    this.userService.updatePhoto(photo);
    this.openResultsPage(photoId);
  }

  private toHashtagCategory(hashtags: HashtagResult[], title: string) {
    var category = new HashtagCategory();
    category.title = title;
    category.tags = [];
    for(let i = 0; i < hashtags.length; i++) {
      var hashtag = new Hashtag({title: hashtags[i].name});
      category.tags.push(hashtag);
    }
    return category;
  }

  private storePhoto(image: ImageAsset): Observable<string> {
    return new Observable<string>(observer => {
      fromAsset(image).then(imageSource => {
        var targetFilename = 'img_' + new Date().getTime() + '.jpg';
        const tempPath = knownFolders.documents().path;
        const localFullPath = path.join(tempPath, targetFilename);
        var saved = imageSource.saveToFile(localFullPath, "jpg");
        if(!saved) {
          console.log("Failed to save :'(");
        }
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
