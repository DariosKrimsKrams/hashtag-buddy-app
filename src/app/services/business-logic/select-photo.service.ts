import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as imagepicker from 'nativescript-imagepicker';
import * as Toast from 'nativescript-toast';
import { localize } from 'nativescript-localize/angular';
import { DeviceService } from '../device-photos.service';
import { CustomerService, CustomerCreateStatus } from '../../storages/customer.service';
import { UserService } from '~/app/storages/user.service';
import { PhotosCountService } from '~/app/storages/photos-count.service';
import { EvaluationRepository } from '../repositories/evaluation-repository.service';
import { Photo } from '~/app/models/photo';
import { IHttpResponse } from '~/app/models/request/http-response';
import { HashtagCategory } from '~/app/models/hashtag-category';
import { Subscriber } from 'rxjs';
import { HashtagResult } from '~/app/models/hashtag-result';

@Injectable({
  providedIn: 'root',
})

export class SelectPhotoService {

  constructor(
    private readonly deviceService: DeviceService,
    private readonly customerService: CustomerService,
    private readonly userService: UserService,
    private readonly evaluationRepository: EvaluationRepository,
    private readonly photosCountService: PhotosCountService,
  ) { }

  public pickImage(): Observable<any> {
    return new Observable<any>(observer => {
    let that = this;
    let context = imagepicker.create({
      mode: 'single',
      mediaType: imagepicker.ImagePickerMediaType.Image
    });
    context
      .authorize()
      .then(function() {
        return context.present();
      })
      .then(function(selection) {
        let image = selection[0];
        image.options.width = 1000;
        image.options.height = 1000;
        that.deviceService.setSelectedPhoto(image);
        observer.next(image);
        observer.complete();
      }).catch(function (e) {
        e = e.toString();
        if (e.substr(e.length - 13) !== 'result code 0') {
          console.error('IMAGE PICKER Failed: ', e);
          Toast.makeText(localize('toast_imagepicker_failed'), 'long').show();
        }
        observer.error(e);
        observer.complete();
      });
    });
  }

  public saveAndUploadPhoto(): Observable<any> {
    return new Observable<any>(observer => {
      this.savePhoto().subscribe(photoId => {
        let hasCustomerId = this.customerService.hasCustomerId();
        if (!hasCustomerId) {
            this.customerService.createUserIdIfNotExist().subscribe((status) => {
            if (status === CustomerCreateStatus.NewlyCreated || status === CustomerCreateStatus.AlreadyCreated) {
              this.uploadImage(photoId, observer);
            } else {
              observer.error('customer failed');
              observer.complete();
            }
            });
        } else {
          this.uploadImage(photoId, observer);
        }
      });
    });
  }

  private savePhoto(): Observable<number> {
    return new Observable<number>(observer => {
      let selectedPhoto = this.deviceService.getSelectedPhoto();
      this.deviceService.copyPhotoToAppFolder(selectedPhoto).subscribe(path => {
        let photo = new Photo();
        photo.timestamp = new Date().getTime();
        photo.image = path;
        let photoId = this.userService.addPhoto(photo);
        observer.next(photoId);
        observer.complete();
      });
    });
  }

  private uploadImage(photoId: number, observer: Subscriber<any>): void {
    let customerId = this.customerService.getCustomerId();
    let photo = this.userService.getPhoto(photoId);
    this.evaluationRepository.UploadPhoto(photo.image, customerId)
    .subscribe((httpResponse: IHttpResponse) => {
      console.info(httpResponse);
      if (httpResponse.code === 200) {
        let httpResult = this.parseSuccessfulResponse(httpResponse);
        this.storeHttpResultIntoPhoto(photoId, httpResult);
        this.photosCountService.decrease();
        observer.next(photoId);
        observer.complete();
      } else {
        observer.error('upload failed');
        observer.complete();
      }
    });
  }

  private parseSuccessfulResponse(httpResponse: IHttpResponse): {categories: HashtagCategory[], logId: number} {
    let data = JSON.parse(httpResponse.message);
    let mostRelevantTags: HashtagResult[] = data.mostRelevantHTags;
    let trendingTags: HashtagResult[] = data.trendingHTags;
    let categories: HashtagCategory[] = [];
    categories.push(HashtagCategory.fromHashtagResult(mostRelevantTags, 'results_category_generic_hashtags'));
    categories.push(HashtagCategory.fromHashtagResult(trendingTags, 'results_category_niche_hashtags'));
    return { categories: categories, logId: data.logId };
  }

  private storeHttpResultIntoPhoto(photoId: number, httpResult: {categories: HashtagCategory[], logId: number}): void {
    let photo = this.userService.getPhoto(photoId);
    photo.categories = httpResult.categories;
    photo.logId = httpResult.logId;
    photo.proMode = this.photosCountService.getTotalCount() > 0;
    photo.censorHashtags();
    this.userService.updatePhoto(photo);
  }

}