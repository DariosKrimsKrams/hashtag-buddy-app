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
  public email = '';
  public message = '';

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
    if(this.email === "" || this.message === ""){
      console.log('empty');
      return false;
    }
    let feedback = { 
      customerId: "0317a2e8e1bbae79184524ea1322c152407a0bc1e7f4837571ee3517e9360da4", 
      photoId: '', 
      rating: '', 
      goodHashtags: '', 
      badHashtags: '', 
      missingHashtags: '', 
      comment: this.message 
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

  emailChange(text: string) {
    this.email = text;
  }

  messageChange(text: string) {
    this.message = text;
  }

}
