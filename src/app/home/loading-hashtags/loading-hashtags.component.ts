import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "ui/page";

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.css'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit {

  public loading = "~/app/assets/loading.html";

  constructor(
    private page: Page,
    private router: RouterExtensions,
    ) {
      this.page.actionBarHidden = true;
    }

  ngOnInit() {    
    setTimeout (() => { 
      this.router.navigate(["/home/results/1"], {
        transition: {
          name: "FadeIn",
          duration: 500,
          curve: "easeOut"
        }
      });
     }, 3000);
  }

  random(min = 50, max = 150) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
