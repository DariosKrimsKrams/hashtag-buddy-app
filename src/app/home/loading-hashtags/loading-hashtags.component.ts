import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.css'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit {

  countDots: number = 0;
  progress: number = 0;
  tipI18nKey: string;

  constructor(
    private page: Page,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
     this.animateDots();
    //  this.animateProgess();
     this.animateTips();
  }

  private animateDots(): void {
    setInterval.bind(this)(() => {
      this.countDots = this.countDots >= 3 ? 0 : this.countDots + 1;
    }, 600);
  }

  // private animateProgess(): void { 
  //   var overallSec = 20;
  //   var maxProgress = 99;
  //   var interval = overallSec*1000/maxProgress;
  //   setInterval.bind(this)(() => {
  //     this.progress++;
  //   }, interval);
  // }

  private animateTips(): void {
    this.tipI18nKey = "diduknow_fact1";
  }

}
