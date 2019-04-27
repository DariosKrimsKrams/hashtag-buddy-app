import { Component, OnInit, OnDestroy } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.css'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit, OnDestroy {

  countDots: number = 0;
  progress: number = 0;
  tipNo: number;

  private tipTimeSec: number = 7;

  constructor(
    private page: Page,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.animateDots();
    this.animateTips();

    // event for open this
    // if status Upload not set
      // redirect to home
  }

  ngOnDestroy(): void {
    console.log("LoadingHashtagsComponent On Destroy");
    // ToDo Cancel Interval
    // problem: this will not be called
  }

  private animateDots(): void {
    setInterval.bind(this)(() => {
      this.countDots = this.countDots >= 3 ? 0 : this.countDots + 1;
    }, 600);
  }

  private animateTips(): void {
    this.tipNo = Math.floor(Math.random() * 23.99);
    setInterval.bind(this)(() => {
      this.tipNo = Math.floor(Math.random() * 23.99);
      // console.log(this.tipNo)
    }, this.tipTimeSec * 1000);
  }

}
