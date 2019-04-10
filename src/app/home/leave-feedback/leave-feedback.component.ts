import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";
import { UserService } from '~/app/storages/user.service';
import { Hashtag } from '~/app/models/hashtag';
import { ResultFeedback } from '~/app/models/result-feedback';
import { FeedbackRepository } from '~/app/services/feedback-repository.service';
import { fromFile, ImageSource } from 'tns-core-modules/image-source/image-source';
import { shareInstagram } from 'nativescript-instagram-share';
import { Photo } from '~/app/models/photo';
import { DeviceService } from '~/app/services/device-photos.service';
import { ActivatedRoute } from '@angular/router';
import { Folder, knownFolders, path } from 'tns-core-modules/file-system/file-system';
import { SelectedHashtag } from '~/app/models/selected-hashtag';

@Component({
  templateUrl: './leave-feedback.component.html',
  styleUrls: ['./leave-feedback.component.css'],
  moduleId: module.id,
})
export class LeaveFeedbackComponent implements OnInit {

  public userSelectedHashtags: Hashtag[] = [];
  public userNotSelectedHashtags: Hashtag[] = [];
  public emoji = ['great', 'satisfied', 'bad'];
  public tag1: number[] = [];
  public tag2: number[] = [];
  public rating_number = 3; // 0=great, 1=satisfied, 2=bad, 3=none 
  public missingHashtags = '';
  public comment = '';
  private photo: Photo;

  constructor(
    private page: Page,
    private route: ActivatedRoute,
    private router: RouterExtensions,
    private userService: UserService,
    private feedbackRepositoryService: FeedbackRepository,
    ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.photo = this.userService.getPhoto(id);

    this.userSelectedHashtags = this.getUserSelectedHashtags();
    this.userNotSelectedHashtags = this.getUserNotSelectedHashtags();


    // ToDo load feedback if available
    //this.photo.feedback
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
        if(!exist) {
          hashtags.push(hashtag);
        }
      }
    }
    return hashtags;
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

    let good_hashtags = '';
    let bad_hashtags = '';
    let k = 0;
    for(let i = 0; i < this.userSelectedHashtags.length ; i++) {
      if(this.tag1[i]) {
        if(k === 0){
          // ToDo why does some variables are snake_case and some have CamelCase style
          good_hashtags = '{';
          k++;
        }
        if(k > 1) good_hashtags += ",";
        good_hashtags += "'" + this.userSelectedHashtags[i] + "'";
      }
    }
    if(k > 0) {
      good_hashtags += "}";
    }

    k = 0;
    for(let i = 0; i < this.userNotSelectedHashtags.length ; i++) {
      if(this.tag2[i]) {
        if(k === 0){
          bad_hashtags = '{';
          k++;
        }
        if(k > 1) bad_hashtags += ",";
        bad_hashtags += "'" + this.userNotSelectedHashtags[i] + "'";
      }
    }
    if(k > 0) {
      bad_hashtags += "}";
    }
    // ToDo server receives: goodHashtags":"{'[object Object]'}","badHashtags":"{'[object Object]'}"
  
    let feedback = { 
      customerId: "0317a2e8e1bbae79184524ea1322c152407a0bc1e7f4837571ee3517e9360da4", 
      photoId: '123', 
      rating: rating, 
      goodHashtags: good_hashtags, 
      badHashtags: bad_hashtags, 
      missingHashtags: this.missingHashtags, 
      comment: this.comment 
    }
    this.feedbackRepositoryService.addResultFeedback(feedback as ResultFeedback);
    // .subscribe(feedback => {
    //   // this is null, is that correct?
    //   console.log(feedback);
    // });
    this.openInstagram();

    // ToDo there is the possibility to click on Send-Button twice / multiple times.
    // Even with OpenInstagram logic coming soon, it should be able to double-send without any changes between the sendings
    // (that means: if the user change some value, another sending should be allowed)
  }

  continueWithoutFeedback() {
    this.openInstagram();
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

  private openInstagram(): void {

    let image = this.getImageSource();
    // let image = this.photo.image;
    shareInstagram(image).then((r)=>{
      console.log("instagram open succcessfully", r);
  }).catch((e)=>{
      console.log("instagram is not installed");
      console.log("error", e);
  });
    // ToDo change to putExtra(img, text)
    
  }

  private getImageSource(): ImageSource {
    const image = <ImageSource>fromFile(this.photo.image);
    return image;
  }

}
