import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
  moduleId: module.id
})
export class CircularProgressBarComponent implements OnInit {

  private percentValue: number = 0;
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
    }, environment.loadingTimeSec * 1000 / 99);
  }

  public animateBar(): void {
    this.barElement.nativeElement.animate({
      rotate: 360 + 45,
      duration: 2000,
    }).then(() => {
      this.barElement.nativeElement.rotate = 45;
      this.animateBar();
    });
  }

}
