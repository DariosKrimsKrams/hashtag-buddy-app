import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";
import { UserService } from '~/app/storages/user.service';
import { Hashtag } from '~/app/models/hashtag';
import { ResultFeedback } from '~/app/models/result-feedback';
import { FeedbackRepository } from '~/app/services/feedback-repository.service';
import { fromFile, ImageSource } from 'tns-core-modules/image-source/image-source';
import { shareInstagram } from 'nativescript-instagram-share';
import { Photo } from '~/app/models/photo';
import { ActivatedRoute } from '@angular/router';
import { SelectedHashtag } from '~/app/models/selected-hashtag';
import { ResultFeedbackRequest } from '~/app/models/request/result-feedback-request';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/pages/feedback/modal/modal.component';

@Component({
  templateUrl: './leave-feedback.component.html',
  styleUrls: ['./leave-feedback.component.css'],
  moduleId: module.id,
})
export class LeaveFeedbackComponent implements OnInit {

  public rating = 3; // 0=great, 1=satisfied, 2=bad, 3=none 
  public tag1: any[] = [];
  public tag2: any[] = [];
  public missingHashtags = '';
  public comment = '';
  public userSelectedHashtags: Hashtag[] = [];
  public userNotSelectedHashtags: Hashtag[] = [];
  public emoji = ['great', 'satisfied', 'bad'];
  
  private photo: Photo;

  constructor(
    private page: Page,
    private route: ActivatedRoute,
    private router: RouterExtensions,
    private userService: UserService,
    private feedbackRepositoryService: FeedbackRepository,
    private viewContainerRef: ViewContainerRef,
    private modalService: ModalDialogService, 
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.photo = this.userService.getPhoto(id);
    this.userSelectedHashtags = this.getUserSelectedHashtags();
    this.userNotSelectedHashtags = this.getUserNotSelectedHashtags();
    this.restoreFeedback(this.photo.feedback);
  }

  private restoreFeedback(feedback: ResultFeedback): void {
    if(feedback === undefined) {
      return;
    }
    this.rating = feedback.rating;
    this.tag1 = feedback.goodHashtags;
    this.tag2 = feedback.badHashtags;
    this.missingHashtags = feedback.missingHashtags;
    this.comment = feedback.comment;
  }

  public getUserSelectedHashtags(): SelectedHashtag[] {
    var hashtags: SelectedHashtag[] = [];
    this.photo.selectedHashtags.forEach(hashtag => {
      if(hashtag.categoryId != -1) {
        hashtags.push(hashtag);
      }
    });
    return hashtags;
  }

  public getUserNotSelectedHashtags(): Hashtag[] {
    var hashtags: Hashtag[] = [];
    for(var i = 0; i < this.photo.categories.length; i++) {
      var category = this.photo.categories[i];
      for(var j = 0; j < category.tags.length; j++) {
        var hashtag = category.tags[j];
        var exist = this.photo.selectedHashtags.filter(x => x.title == hashtag.title)[0] !== undefined;
        if(!exist && !hashtag.isCensored) {
          hashtags.push(hashtag);
        }
      }
    }
    return hashtags;
  }

  public sendFeedback(): void {
    if(this.missingHashtags === ''
      && this.comment === ''
      && this.rating === 3
      && this.tag1.length == 0
      && this.tag2.length == 0
    ){
      console.log('empty');
      this.continue();
      return;
    }
    this.photo.feedback = new ResultFeedback({ 
      rating: this.rating, 
      goodHashtags: this.tag1, 
      badHashtags: this.tag2, 
      missingHashtags: this.missingHashtags, 
      comment: this.comment 
    });
    this.userService.updatePhoto(this.photo);
    this.doRequest(this.photo);
    this.continue();
  }

  private showModal(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { autoClose: true, button: '' }
    };
    this.modalService.showModal(ModalComponent, options);
  }

  private doRequest(photo: Photo): void {
    var feedback = photo.feedback;
    var rating = feedback.rating == 0 ? 'great' : feedback.rating == 1 ? 'satisfied' : feedback.rating == 2 ? 'bad' : 'none';
    var goodHashtags = this.getHashtagsByIndizes(this.userSelectedHashtags, feedback.goodHashtags);
    var badHashtags = this.getHashtagsByIndizes(this.userNotSelectedHashtags, feedback.badHashtags);
    var customerId = this.userService.getUserId();

    const feedbackDto: ResultFeedbackRequest = new ResultFeedbackRequest({ 
      customerId: customerId,
      photoId: photo.logId,
      rating: rating,
      goodHashtags: goodHashtags, 
      badHashtags: badHashtags, 
      missingHashtags: feedback.missingHashtags, 
      comment: feedback.comment 
    });
    this.feedbackRepositoryService.sendResultFeedback(feedbackDto);
  }

  private getHashtagsByIndizes(hashtags: Hashtag[], indizes: any[]): string[] {
    var result: string[] = [];
    for(let key in indizes) {
      if(indizes[key]) {
        var hashtag = hashtags[key];
        result.push(hashtag.title);
      }
    }
    return result;
  }

  public continue(): void {
    this.showModal();
    // this.openInstagram();
  }

  public goPrevPage(): void {
    this.router.navigate(["/home/results/1"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  public setMissingHashtags(text: string): void {
    this.missingHashtags = text;
  }

  public commentChange(text: string): void {
    this.comment = text;
  }

  // private openInstagram(): void {
  //   let image = this.getImageSource();
  //   // let image = this.photo.image;
  //   shareInstagram(image).then((r)=>{
  //     console.log("instagram open succcessfully", r);
  //   }).catch((e)=>{
  //     console.log("instagram is not installed");
  //     console.log("error", e);
  //   });
  //   // ToDo change to putExtra(img, text)
  // }

  private getImageSource(): ImageSource {
    const image = <ImageSource>fromFile(this.photo.image);
    return image;
  }

}
