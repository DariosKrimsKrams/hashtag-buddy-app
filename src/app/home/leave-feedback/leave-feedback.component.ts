import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";
import { UserStorageService } from '~/app/storages/user-storage.service';
import { Hashtag } from '~/app/models/hashtag';

import { FeedbackService } from "~/app/services/feedback.service";
import { ResultFeedback } from '~/app/models/result-feedback';

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
  rating_number = 3;
  good_hashtags = '';
  bad_hashtags = '';
  public missinghashtags = '';
  public comment = '';

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userStorage: UserStorageService,
    private feedbackService: FeedbackService,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.userSelectedHashtags = this.userStorage.getUserSelectedHashtags(1);
    this.userNotSelectedHashtags = this.userStorage.getUserNotSelectedHashtags(1);
  }

  send() {
    if(this.missinghashtags === "" || this.comment === ""){
      console.log('empty');
      return false;
    }
    let rating = 'none';
    if(this.rating_number === 0) {
      rating = 'great';
    }else if(this.rating_number === 1) {
      rating = 'satisfied';
    }else if(this.rating_number === 2) {
      rating = 'bad';
    }
    let k = 0;
    for(let i = 0; i < this.userSelectedHashtags.length ; i++) {
      if(this.tag1[i]) {
        if(k === 0){
          this.good_hashtags = '{';
          k++;
        }
        if(k > 1) this.good_hashtags += ",";
        this.good_hashtags += "'" + this.userSelectedHashtags[i] + "'";
      }
    }
    if(k > 0) this.good_hashtags += "}";

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
    if(k > 0) this.bad_hashtags += "}";
  
    let feedback = { 
      customerId: "0317a2e8e1bbae79184524ea1322c152407a0bc1e7f4837571ee3517e9360da4", 
      photoId: '', 
      rating: rating, 
      goodHashtags: this.good_hashtags, 
      badHashtags: this.bad_hashtags, 
      missingHashtags: this.missinghashtags, 
      comment: this.comment 
    }
    this.feedbackService.addResultFeedback(feedback as ResultFeedback)
    .subscribe(feedback => {
    });   
  }

  skip() {

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

  missingHashtags(text: string) {
    this.email = text;
  }

  commentChange(text: string) {
    this.comment = text;
  }

}
