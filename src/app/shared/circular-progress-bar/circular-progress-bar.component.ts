import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
  moduleId: module.id
})
export class CircularProgressBarComponent implements OnInit {

  private percentValue: number = 0;
  private timeSec: number = 20;
  @ViewChild('bar', { read: ElementRef, static: false }) public barElement: ElementRef;

  constructor(
  ) { }

  public ngOnInit(): void {
    this.animate();
    // Need Timeout because of Bug :'(
    setTimeout.bind(this)(() => {
      this.animateBar();
    }, 1);
  }

  public get text(): string {
    return `${this.percentValue.toFixed()} %`;
  }

  private animate(): void {
    const intervalId = setInterval.bind(this)(() => {
      this.percentValue++;
      if (this.percentValue >= 99) {
        clearInterval(intervalId);
      }
    }, this.timeSec * 1000 / 99);
  }

  public animateBar(): void {
    this.barElement.nativeElement.animate({
      rotate: 405,
      duration: 2000,
    }).then(() => {
      this.barElement.nativeElement.rotate = 45;
      this.animateBar();
    });
  }

}
