import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { UserService } from '~/app/storages/user.service';
import { Hashtag } from '~/app/models/hashtag';
import { ResultFeedback } from '~/app/models/result-feedback';
import { Photo } from '~/app/models/photo';
import { ActivatedRoute } from '@angular/router';
import { ResultFeedbackRequest } from '~/app/models/request/result-feedback-request';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { ModalComponent } from '~/app/shared/modal/modal.component';
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
  public tags1: string[] = [];
  public tags2: string[] = [];
  public missingHashtags: string = '';
  public comment: string = '';
  public userSelectedHashtags: Hashtag[];
  public userNotSelectedHashtags: Hashtag[];
  public emojis: string[] = ['great', 'satisfied', 'bad'];

  private rating: Rating = Rating.None;
  private photo: Photo;
  private leftFeedback: boolean = false;

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

  public ngOnInit(): void {
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

  public getUserSelectedHashtags(): Hashtag[] {
    const hashtags: Hashtag[] = [];
    this.photo.selectedHashtags.forEach(selectedHashtag => {
      if (Photo.isHashtagPartOfAnyCategory(this.photo, selectedHashtag.title)) {
        hashtags.push(selectedHashtag);
      }
    });
    return hashtags;
  }

  public getUserNotSelectedHashtags(): Hashtag[] {
    const hashtags: Hashtag[] = [];
    for (let i = 0; i < this.photo.categories.length; i++) {
      const category = this.photo.categories[i];
      for (let j = 0; j < category.tags.length; j++) {
        const hashtag = category.tags[j];
        const exist = this.photo.selectedHashtags.filter(x => x.title === hashtag.title)[0] !== undefined;
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
    this.showModal();
    if (this.missingHashtags === ''
      && this.comment === ''
      && this.rating === Rating.None
      && this.tags1.length === 0
      && this.tags2.length === 0
    ) {
      return;
    }
    this.leftFeedback = true;
    this.saveFeedback();
    this.doRequest(this.photo);
  }

  private showModal(): void {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {
        autoCloseTime: 3000,
        icon: 'copied',
        headline: 'feedback_successful_headline',
        desc: 'feedback_successful_desc'
      }
    };
    this.modalService.showModal(ModalComponent, options).then(() => {
      this.redirectToHome();
    });
  }

  public redirectToHome(): void {
    setTimeout.bind(this)(() => {
      this.router.navigate(['/home'], {
        transition: {
          name: 'slideRight',
          duration: 500,
          curve: 'easeOut'
        }
      });
      if (this.leftFeedback) {
        this.userService.openFeedbackModal.emit();
      }
    }, 100);
  }

  private doRequest(photo: Photo): void {
    const feedback = photo.feedback;
    const customerId = this.customerService.getCustomerId();

    const feedbackDto: ResultFeedbackRequest = new ResultFeedbackRequest({
      customerId: customerId,
      photoId: photo.logId,
      rating: feedback.rating,
      goodHashtags: feedback.goodHashtags,
      badHashtags: feedback.badHashtags,
      missingHashtags: feedback.missingHashtags,
      comment: feedback.comment
    });
    console.log('leave Feedback with user:');
    console.log(feedbackDto);
    this.feedbackRepositoryService.sendResultFeedback(feedbackDto);
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
    const i = source.indexOf(tag.title);
    if (i !== -1) {
      source.splice(i, 1);
    } else {
      source.push(tag.title);
    }
    this.saveFeedback();
  }

}
