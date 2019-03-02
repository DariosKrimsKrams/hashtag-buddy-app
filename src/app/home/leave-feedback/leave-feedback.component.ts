import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";
import { UserStorageService } from '~/app/storages/user-storage.service';
import { Hashtag } from '~/app/models/hashtag';

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

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private userStorage: UserStorageService
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.userSelectedHashtags = this.userStorage.getUserSelectedHashtags(1);
    this.userNotSelectedHashtags = this.userStorage.getUserNotSelectedHashtags(1);
  }

  send() {

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

}
