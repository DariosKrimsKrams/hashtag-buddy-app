import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";
import { UserService } from '~/app/storages/user.service';
import { Hashtag } from '~/app/models/hashtag';
import { ResultFeedback } from '~/app/models/result-feedback';
import { FeedbackRepositoryService } from '~/app/services/feedback-repository.service';

@Component({
  selector: 'ns-leave-feedback',
  templateUrl: './leave-feedback.component.html',
  styleUrls: ['./leave-feedback.component.css'],
  moduleId: module.id,
})
export class LeaveFeedbackComponent implements OnInit {

  userSelectedHashtags: Hashtag[];
  userNotSelectedHashtags: Hashtag[];
  
  emoji = ['great', 'satisfied', 'bad'];
  selected = [];
  tag1 = [];
  tag2 = [];
  rating_number = 3; // what does "3" mean? 3=none?
  good_hashtags = '';
  bad_hashtags = '';
  public missingHashtags = '';
  public comment = '';

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userStorage: UserService,
    private feedbackRepositoryService: FeedbackRepositoryService,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.userSelectedHashtags = this.userStorage.getUserSelectedHashtags(1);
    this.userNotSelectedHashtags = this.userStorage.getUserNotSelectedHashtags(1);
  }

  sendFeedback() {
    if(this.missingHashtags === ""
      && this.comment === ""
      && this.rating_number === undefined
      // ToDo if all fields are empty
    ){
      console.log('empty');
      this.continueWithoutFeedback();
      return;
    }

    let rating = 'none';
    switch(this.rating_number) {
      case 0:
        rating = 'great';
        break;
      case 1:
        rating = 'satisfied';
        break;
      case 2:
        rating = 'bad';
        break;
    }

    let k = 0;
    for(let i = 0; i < this.userSelectedHashtags.length ; i++) {
      if(this.tag1[i]) {
        if(k === 0){
          // ToDo why does some variables are snake_case and some have CamelCase style
          this.good_hashtags = '{';
          k++;
        }
        if(k > 1) this.good_hashtags += ",";
        this.good_hashtags += "'" + this.userSelectedHashtags[i] + "'";
      }
    }
    if(k > 0) {
      this.good_hashtags += "}";
    }

    k = 0;
    for(let i = 0; i < this.userNotSelectedHashtags.length ; i++) {
      if(this.tag2[i]) {
        if(k === 0){
          this.bad_hashtags = '{';
          k++;
        }
        if(k > 1) this.bad_hashtags += ",";
        this.bad_hashtags += "'" + this.userNotSelectedHashtags[i] + "'";
      }
    }
    if(k > 0) {
      this.bad_hashtags += "}";
    }
    // ToDo server receives: goodHashtags":"{'[object Object]'}","badHashtags":"{'[object Object]'}"
  
    let feedback = { 
      customerId: "0317a2e8e1bbae79184524ea1322c152407a0bc1e7f4837571ee3517e9360da4", 
      photoId: '123', 
      rating: rating, 
      goodHashtags: this.good_hashtags, 
      badHashtags: this.bad_hashtags, 
      missingHashtags: this.missingHashtags, 
      comment: this.comment 
    }
    this.feedbackRepositoryService.addResultFeedback(feedback as ResultFeedback)
    .subscribe(feedback => {
      // this is null, is that correct?
      console.log(feedback);
    });
    this.openInstagram();

    // ToDo there is the possibility to click on Send-Button twice / multiple times.
    // Even with OpenInstagram logic coming soon, it should be able to double-send without any changes between the sendings
    // (that means: if the user change some value, another sending should be allowed)
  }

  continueWithoutFeedback() {
    this.openInstagram();
  }

  openInstagram() {
    // ToDo here transfer-to-instagram logic
  }

  goPrevPage() {
    this.router.navigate(["/home/results/1"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    });
  }

  setMissingHashtags(text: string) {
    this.missingHashtags = text;
  }

  commentChange(text: string) {
    this.comment = text;
  }

}
