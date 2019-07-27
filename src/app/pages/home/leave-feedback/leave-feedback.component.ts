import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { UserService } from '~/app/storages/user.service';
import { Hashtag } from '~/app/models/hashtag';
import { ResultFeedback } from '~/app/models/result-feedback';
import { Photo } from '~/app/models/photo';
import { ActivatedRoute } from '@angular/router';
import { SelectedHashtag } from '~/app/models/selected-hashtag';
import { ResultFeedbackRequest } from '~/app/models/request/result-feedback-request';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/pages/feedback/modal/modal.component';
import { CustomerService } from '~/app/storages/customer.service';
import { FeedbackRepository } from '~/app/services/repositories/feedback-repository.service';
import { Rating } from '~/app/models/rating';

@Component({
  templateUrl: './leave-feedback.component.html',
  styleUrls: ['./leave-feedback.component.scss'],
  moduleId: module.id
})
export class LeaveFeedbackComponent implements OnInit {

  public ratingIndex: number;
  private rating: Rating = Rating.None;
  public tags1: string[] = [];
  public tags2: string[] = [];
  public missingHashtags = '';
  public comment = '';
  public userSelectedHashtags: Hashtag[] = [];
  public userNotSelectedHashtags: Hashtag[] = [];
  public emojis = ['great', 'satisfied', 'bad'];
  
  private photo: Photo;

  constructor(
    private readonly page: Page,
    private readonly route: ActivatedRoute,
    private readonly router: RouterExtensions,
    private readonly userService: UserService,
    private readonly feedbackRepositoryService: FeedbackRepository,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly modalService: ModalDialogService, 
    private readonly customerService: CustomerService,
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
    if (feedback === undefined) {
      return;
    }
    this.rating = feedback.rating;
    this.ratingIndex = feedback.rating === Rating.Great ? 0 : feedback.rating === Rating.Satisfied ? 1 : feedback.rating === Rating.Bad ? 2 : 3;

    this.tags1 = feedback.goodHashtags;
    this.tags2 = feedback.badHashtags;
    this.missingHashtags = feedback.missingHashtags;
    this.comment = feedback.comment;
  }

  public getUserSelectedHashtags(): SelectedHashtag[] {
    let hashtags: SelectedHashtag[] = [];
    this.photo.selectedHashtags.forEach(hashtag => {
      if (hashtag.categoryId !== -1) {
        hashtags.push(hashtag);
      }
    });
    return hashtags;
  }

  public getUserNotSelectedHashtags(): Hashtag[] {
    let hashtags: Hashtag[] = [];
    for (let i = 0; i < this.photo.categories.length; i++) {
      let category = this.photo.categories[i];
      for (let j = 0; j < category.tags.length; j++) {
        let hashtag = category.tags[j];
        let exist = this.photo.selectedHashtags.filter(x => x.title === hashtag.title)[0] !== undefined;
        if (!exist && !hashtag.isCensored) {
          hashtags.push(hashtag);
        }
      }
    }
    return hashtags;
  }

  public saveFeedback(): void {
    this.photo.feedback = new ResultFeedback({ 
      rating: this.rating, 
      goodHashtags: this.tags1, 
      badHashtags: this.tags2, 
      missingHashtags: this.missingHashtags, 
      comment: this.comment 
    });
    this.userService.updatePhoto(this.photo);
  }

  public sendFeedback(): void {
    if (this.missingHashtags === ''
      && this.comment === ''
      && this.rating === Rating.None
      && this.tags1.length === 0
      && this.tags2.length === 0
    ) {
      this.continue();
      return;
    }
    this.saveFeedback(); // save input fields
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
    let feedback = photo.feedback;
    let customerId = this.customerService.getCustomerId();

    const feedbackDto: ResultFeedbackRequest = new ResultFeedbackRequest({ 
      customerId: customerId,
      photoId: photo.logId,
      rating: feedback.rating,
      goodHashtags: feedback.goodHashtags, 
      badHashtags: feedback.badHashtags, 
      missingHashtags: feedback.missingHashtags, 
      comment: feedback.comment 
    });
    this.feedbackRepositoryService.sendResultFeedback(feedbackDto);
  }

  public continue(): void {
    this.showModal();
  }

  public goPrevPage(): void {
    this.router.navigate([`/home/results/${this.photo.id}`], {
      transition: {
        name: 'slideRight',
        duration: 500,
        curve: 'easeOut'
      }
    });
  }

  public setMissingHashtags(text: string): void {
    this.missingHashtags = text;
  }

  public commentChange(text: string): void {
    this.comment = text;
  }

  public clickEmoji(name: string, index: number): void {
    this.rating = name === 'satisfied' ? Rating.Satisfied : name === 'great' ? Rating.Great : name === 'bad' ? Rating.Bad : Rating.None;
    this.ratingIndex = index;
    this.saveFeedback();
  }

  public clickGoodHashtag(tag: Hashtag): void {
    this.addRemoveHashtags(this.tags1, tag);
  }

  public clickBadHashtag(tag: Hashtag): void {
    this.addRemoveHashtags(this.tags2, tag);
  }

  private addRemoveHashtags(source: string[], tag: Hashtag): void {
    let i = source.indexOf(tag.title);
    if (i !== -1) {
      source.splice(i, 1);
    } else {
      source.push(tag.title);
    }
    this.saveFeedback();
  }

}
