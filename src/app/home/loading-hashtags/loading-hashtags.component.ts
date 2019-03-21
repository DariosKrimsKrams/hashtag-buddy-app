import { Component, OnInit } from '@angular/core';
import { Page } from "ui/page";

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.css'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit {

  countDots: number = 0;

  constructor(
    private page: Page,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
     this.animateDots();
  }

  private animateDots(): void {
    var that = this;
    setInterval(() => {
      that.countDots = that.countDots >= 3 ? 0 : that.countDots + 1;
    }, 600);
  }

}
