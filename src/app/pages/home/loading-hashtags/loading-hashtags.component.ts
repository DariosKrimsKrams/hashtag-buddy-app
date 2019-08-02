import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-loading-hashtags',
  templateUrl: './loading-hashtags.component.html',
  styleUrls: ['./loading-hashtags.component.scss'],
  moduleId: module.id,
})
export class LoadingHashtagsComponent implements OnInit {

  public countDots: number = 0;
  public progress: number = 0;
  public tipNo: number;

  private tipTimeSec: number = 7;

  constructor(
    private page: Page,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {

    this.animateDots();
    this.animateTips();
    
    // ToDo Cancel Interval
    // problem: this will not be called
  }

  private animateDots(): void {
    setInterval.bind(this)(() => {
      this.countDots = this.countDots >= 3 ? 0 : this.countDots + 1;
    }, 600);
  }

  private animateTips(): void {
    this.tipNo = this.getRandom();
    setInterval.bind(this)(() => {
      this.tipNo = this.getRandom();
    }, this.tipTimeSec * 1000);
  }

  private getRandom(): number {
    const min = 1;
    const max = 22;
    return Math.floor(Math.random() * (max - 0.01)) + min;
  }

}
