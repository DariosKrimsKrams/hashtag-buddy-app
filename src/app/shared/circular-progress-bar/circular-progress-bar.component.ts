import { Component, Input, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'circularProgressBar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.css'],
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressBarComponent implements OnInit {
  
  private percentValue: number = 0;
  private timeSec: number = 30;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.animate();
  }

  public get text(): string {
    return `${this.percentValue.toFixed()} %`;
  }

  private animate(): void {
    let intervalId = setInterval.bind(this)(() => {
      this.percentValue++;
      this.cd.detectChanges();
      if (this.percentValue >= 99) {
        clearInterval(intervalId);
      }
    }, this.timeSec * 1000 / 99);
  }
  
}
