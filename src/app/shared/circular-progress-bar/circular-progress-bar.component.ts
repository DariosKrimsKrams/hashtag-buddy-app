import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.css'],
  moduleId: module.id
})
export class CircularProgressBarComponent implements OnInit {
  
  private percentValue: number = 0;
  private timeSec: number = 30;
  @ViewChild("bar") barElement: ElementRef;

  constructor(
  ) { }

  ngOnInit() {
    this.animate();
    // Need Timeout because of Bug :'(
    var that = this;
    setTimeout(function() {
      that.animateBar();
    }, 1);
  }

  public get text(): string {
    return `${this.percentValue.toFixed()} %`;
  }

  private animate(): void {
    let intervalId = setInterval.bind(this)(() => {
      this.percentValue++;
      if (this.percentValue >= 99) {
        clearInterval(intervalId);
      }
    }, this.timeSec * 1000 / 99);
  }

  animateBar() {
    this.barElement.nativeElement.animate({
      rotate: 405,
      duration: 2000,
    }).then(() => {
      this.barElement.nativeElement.rotate = 45;
      this.animateBar();
    });
  }
  
}
